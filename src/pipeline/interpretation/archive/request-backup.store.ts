import { Injectable, Logger } from "@nestjs/common";
import { MongoService } from "../../../infra/mongo/mongo.service";
import { MongoTtlManager } from "../../../infra/mongo/mongo-ttl.manager";
import { InterpretationMessage } from "../messages/interfaces/message.types";
import { interpretationArchiveConfig } from "../config/archive.config";
import { RecoveryFailureCode } from "../recovery/recovery.types";

export type RequestBackupStatus = "pending" | "backlog";

export interface RequestBackupDocument {
  requestId: string;
  userId: string;
  username: string;
  payload: string;
  createdAt: string;
  retryCount: number;
  storedAt: string;
  status: RequestBackupStatus;
  lastErrorMessage?: string;
  lastBacklogAt?: string;
  lastErrorCode?: RecoveryFailureCode;
  nextRetryAt?: string;
}

@Injectable()
export class RequestBackupStore {
  private readonly logger = new Logger(RequestBackupStore.name);
  private readonly collectionName = "interpretation_requests";
  private readonly ttlSeconds: number;

  constructor(
    private readonly mongoService: MongoService,
    private readonly ttlManager: MongoTtlManager
  ) {
    const ttlDays = interpretationArchiveConfig.requestTtlDays ?? 0;
    this.ttlSeconds = ttlDays > 0 ? ttlDays * 24 * 60 * 60 : 0;
  }

  public async savePendingRequest(message: InterpretationMessage) {
    const collection = this.mongoService.getCollection(this.collectionName);
    if (!collection) {
      this.logger.warn(
        `MongoDB 미연결 상태 – 요청 ${message.requestId} 저장 실패`
      );
      return;
    }

    await this.ttlManager.ensureIndex(collection, "storedAt", this.ttlSeconds);
    const doc: RequestBackupDocument = {
      requestId: message.requestId,
      userId: message.userId,
      username: message.username,
      payload: JSON.stringify(message.payload),
      createdAt: message.createdAt,
      retryCount: message.retryCount,
      storedAt: new Date().toISOString(),
      status: "pending",
    };

    await collection.updateOne(
      { requestId: message.requestId },
      { $set: doc },
      { upsert: true }
    );
  }

  public async markBacklog(
    requestId: string,
    reason: string,
    reasonCode: RecoveryFailureCode,
    nextRetryAt: Date,
    retryCount: number
  ) {
    const collection = this.mongoService.getCollection(this.collectionName);
    if (!collection) {
      return;
    }

    await collection.updateOne(
      { requestId },
      {
        $set: {
          status: "backlog",
          lastErrorMessage: reason,
          lastErrorCode: reasonCode,
          lastBacklogAt: new Date().toISOString(),
          nextRetryAt: nextRetryAt.toISOString(),
          retryCount,
        },
      }
    );
  }

  public async markRequeued(requestId: string) {
    const collection = this.mongoService.getCollection(this.collectionName);
    if (!collection) {
      return;
    }

    await collection.updateOne(
      { requestId },
      {
        $set: {
          status: "pending",
          storedAt: new Date().toISOString(),
        },
        $unset: {
          lastErrorMessage: "",
          lastErrorCode: "",
          lastBacklogAt: "",
          nextRetryAt: "",
        },
      }
    );
  }

  public async delete(requestId: string) {
    const collection = this.mongoService.getCollection(this.collectionName);
    if (!collection) {
      return;
    }

    try {
      await collection.deleteOne({ requestId });
    } catch (error) {
      this.logger.error(
        `[RequestBackupStore] 요청 ${requestId} 삭제 실패`,
        (error as Error)?.message
      );
    }
  }

  public async listBacklog(limit: number): Promise<RequestBackupDocument[]> {
    const collection = this.mongoService.getCollection(this.collectionName);
    if (!collection) {
      return [];
    }

    const now = new Date().toISOString();
    const docs = await collection
      .find({
        status: "backlog",
        $or: [
          { nextRetryAt: { $exists: false } },
          { nextRetryAt: { $lte: now } },
        ],
      })
      .sort({ lastBacklogAt: 1 })
      .limit(limit)
      .toArray();

    return docs as RequestBackupDocument[];
  }

  public toInterpretationMessage(
    doc: RequestBackupDocument
  ): InterpretationMessage {
    return {
      requestId: doc.requestId,
      userId: doc.userId,
      username: doc.username,
      payload: JSON.parse(doc.payload),
      createdAt: doc.createdAt,
      retryCount: doc.retryCount,
    };
  }
}
