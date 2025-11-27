import { Injectable } from "@nestjs/common";

import {
  INTERPRETATION_STATUS_TTL_SECONDS,
  interpretationStatusKey,
} from "../config/storage.config";
import { InterpretationPayloadParser } from "../messages/helpers/interpretation-payload.parser";
import { InterpretationStatusValidator } from "./validation/status.validator";
import { InterpretationStatusRepository } from "./status.repository";
import { InterpretationStatusLogger } from "./status.logger";
import {
  InterpretationPayload,
  InterpretationStatus,
  InterpretationStatusRecord,
  InterpretationUserContext,
} from "../messages/interfaces/message.types";

interface StatusUpdate {
  status?: InterpretationStatus;
  interpretation?: string;
  errorMessage?: string;
  retryCount?: number;
  fromCache?: boolean;
}

@Injectable()
export class InterpretationStatusStore {
  constructor(
    private readonly repository: InterpretationStatusRepository,
    private readonly validator: InterpretationStatusValidator,
    private readonly payloadParser: InterpretationPayloadParser,
    private readonly statusLogger: InterpretationStatusLogger
  ) {}

  // 최초 상태 stream에 등록 -> pending
  public async initialize(
    requestId: string,
    user: InterpretationUserContext,
    payload: InterpretationPayload
  ) {
    const timestamp = new Date().toISOString();
    const key = interpretationStatusKey(requestId);

    await this.repository.initialize(key, {
      requestId,
      userId: user.id,
      username: user.username,
      payload: JSON.stringify(payload),
      status: InterpretationStatus.Pending,
      interpretation: "",
      errorMessage: "",
      retryCount: "0",
      createdAt: timestamp,
      updatedAt: timestamp,
      fromCache: "false",
    });
    await this.repository.touch(key, INTERPRETATION_STATUS_TTL_SECONDS);
    this.statusLogger.initialized(
      requestId,
      user.username,
      payload.dream?.length ?? 0
    );
  }

  public async markPending(requestId: string, errorMessage?: string | null) {
    await this.apply(requestId, {
      status: InterpretationStatus.Pending,
      errorMessage: errorMessage ?? "",
    });
    this.statusLogger.pending(requestId, errorMessage);
  }

  public async markRunning(requestId: string) {
    await this.apply(requestId, {
      status: InterpretationStatus.Running,
    });
    this.statusLogger.running(requestId);
  }

  // completed 체크하고 LLM 응답 포함해서 저장
  public async markCompleted(
    requestId: string,
    interpretation: string,
    options?: { fromCache?: boolean }
  ) {
    await this.apply(requestId, {
      status: InterpretationStatus.Completed,
      interpretation,
      errorMessage: "",
      fromCache: options?.fromCache ?? false,
    });
    this.statusLogger.completed(
      requestId,
      options?.fromCache ?? false
    );
  }

  public async markFailed(requestId: string, errorMessage: string) {
    await this.apply(requestId, {
      status: InterpretationStatus.Failed,
      errorMessage,
    });
    this.statusLogger.failed(requestId, errorMessage);
  }

  // 재시도 카운트++
  public async incrementRetry(requestId: string) {
    const key = interpretationStatusKey(requestId);
    const retryCount = await this.repository.incrementRetry(key);
    await this.repository.touch(key, INTERPRETATION_STATUS_TTL_SECONDS);
    this.statusLogger.retry(requestId, retryCount);
  }

  // stream에서 requestId + userId로 findByStatue
  public async findStatusByRequest(
    requestId: string,
    userId: string
  ): Promise<InterpretationStatusRecord> {
    const key = interpretationStatusKey(requestId);
    const raw = await this.repository.findRaw(key);
    this.validator.validateRawExists(raw);
    const record = this.toRecord(raw);
    this.validator.validateOwner(record, userId);
    return record;
  }

  // Redis Hash에 필드값 update
  private async apply(requestId: string, updates: StatusUpdate) {
    const key = interpretationStatusKey(requestId);
    const timestamp = new Date().toISOString();
    const payload: Record<string, string> = {
      updatedAt: timestamp,
    };

    if (updates.status) {
      payload.status = updates.status;
    }
    if (typeof updates.interpretation === "string") {
      payload.interpretation = updates.interpretation;
    }
    if (typeof updates.errorMessage === "string") {
      payload.errorMessage = updates.errorMessage;
    }
    if (typeof updates.retryCount === "number") {
      payload.retryCount = updates.retryCount.toString();
    }
    if (typeof updates.fromCache === "boolean") {
      payload.fromCache = updates.fromCache ? "true" : "false";
    }

    await this.repository.update(key, payload);
    await this.repository.touch(key, INTERPRETATION_STATUS_TTL_SECONDS);
  }

  private toRecord(raw: Record<string, string>): InterpretationStatusRecord {
    return {
      requestId: raw.requestId,
      userId: raw.userId,
      username: raw.username,
      payload: this.payloadParser.parse(raw.payload),
      status: (raw.status ??
        InterpretationStatus.Pending) as InterpretationStatus,
      interpretation: raw.interpretation || undefined,
      errorMessage: raw.errorMessage || undefined,
      retryCount: Number(raw.retryCount ?? "0"),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      fromCache: raw.fromCache === "true",
    };
  }
}
