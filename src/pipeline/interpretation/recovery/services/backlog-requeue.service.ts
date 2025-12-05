import { Injectable, Logger } from "@nestjs/common";
import { RequestBackupStore, RequestBackupDocument } from "../../archive/request-backup.store";
import { InterpretationStreamWriter } from "../../streams/stream.writer";
import { interpretationRecoveryConfig } from "../../config/archive.config";
import { BacklogRecoveryResult, RecoveryFailureCode } from "../recovery.types";

@Injectable()
export class BacklogRequeueService {
  private readonly logger = new Logger(BacklogRequeueService.name);
  private readonly batchLimit = Math.max(interpretationRecoveryConfig.batchLimit, 1);
  private readonly maxRounds = Math.max(interpretationRecoveryConfig.maxRoundsPerTick, 1);
  private readonly concurrency = Math.max(
    interpretationRecoveryConfig.concurrentRequeues,
    1
  );

  constructor(
    private readonly backupStore: RequestBackupStore,
    private readonly streamWriter: InterpretationStreamWriter
  ) {}

  public async processBacklog(): Promise<BacklogRecoveryResult> {
    let attempted = 0;
    let succeeded = 0;
    let failed = 0;

    for (let round = 0; round < this.maxRounds; round++) {
      const entries = await this.backupStore.listBacklog(this.batchLimit);
      if (!entries.length) {
        break;
      }

      const batchResult = await this.processEntries(entries);
      attempted += batchResult.attempted;
      succeeded += batchResult.succeeded;
      failed += batchResult.failed;

      if (entries.length < this.batchLimit) {
        break;
      }
    }

    if (attempted > 0) {
      this.logger.log(
        `[BacklogRequeue] 재등록 시도 ${attempted}건 – 성공 ${succeeded}, 실패 ${failed}`
      );
    }

    return { attempted, succeeded, failed };
  }

  private async processEntries(entries: RequestBackupDocument[]): Promise<BacklogRecoveryResult> {
    let succeeded = 0;
    let failed = 0;

    // for루프가 chunk base로 돌고, 각 chunk에서 promise.all로 한번에 묶어서 실행
    for (let i = 0; i < entries.length; i += this.concurrency) {
      const chunk = entries.slice(i, i + this.concurrency);
      const results = await Promise.all(
          chunk.map((entry) => this.requeueEntry(entry))
      );
      for (const result of results) {
        if (result) {
          succeeded += 1;
        } else {
          failed += 1;
        }
      }
    }

    return {
      attempted: entries.length,
      succeeded,
      failed,
    };
  }

  private async requeueEntry(entry: RequestBackupDocument): Promise<boolean> {
    const message = this.backupStore.toInterpretationMessage(entry);
    try {
      await this.streamWriter.write(message);
      await this.backupStore.markRequeued(entry.requestId);
      return true;
    } catch (error) {
      await this.handleFailure(entry, error);
      return false;
    }
  }

  private async handleFailure(entry: RequestBackupDocument, error: unknown) {
    const retryCount = (entry.retryCount ?? 0) + 1;
    const reasonMessage =
      (error as Error)?.message ?? "failed to enqueue request during recovery";
    const nextRetryAt = this.calculateNextRetry(retryCount);
    await this.backupStore.markBacklog(
      entry.requestId,
      reasonMessage,
      this.deriveFailureCode(error),
      nextRetryAt,
      retryCount
    );
    this.logger.warn(
      `[BacklogRequeue] 요청 ${entry.requestId} 재등록 실패 (retry=${retryCount}) – ${reasonMessage}`
    );
  }

  private deriveFailureCode(error: unknown): RecoveryFailureCode {
    const errorName = (error as Error)?.name ?? "";
    if (errorName.toLowerCase().includes("redis")) {
      return RecoveryFailureCode.REDIS_UNAVAILABLE;
    }
    return RecoveryFailureCode.STREAM_WRITE_FAILED;
  }

  private calculateNextRetry(retryCount: number): Date {
    const { baseDelayMs, maxDelayMs, jitterMs } = interpretationRecoveryConfig.backoff;
    const exponential = baseDelayMs * Math.pow(2, Math.max(retryCount - 1, 0));
    const capped = Math.min(exponential, maxDelayMs);
    const jitter = jitterMs > 0 ? Math.floor(Math.random() * jitterMs) : 0;
    return new Date(Date.now() + capped + jitter);
  }
}
