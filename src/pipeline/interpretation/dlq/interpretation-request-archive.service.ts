import { Injectable, Logger } from "@nestjs/common";
import { MongoService } from "../../../infra/mongo/mongo.service";
import { InterpretationMessage } from "../messages/interfaces/message.types";
import { interpretationArchiveConfig } from "../config/archive.config";
import { MongoTtlManager } from "../../../infra/mongo/mongo-ttl.manager";

@Injectable()
export class InterpretationRequestArchiveService {
  private readonly logger = new Logger(
    InterpretationRequestArchiveService.name
  );
  private readonly collectionName = "interpretation_requests";
  private readonly ttlSeconds: number;

  constructor(
    private readonly mongoService: MongoService,
    private readonly ttlManager: MongoTtlManager
  ) {
    const ttlDays = interpretationArchiveConfig.requestTtlDays ?? 0;
    this.ttlSeconds = ttlDays > 0 ? ttlDays * 24 * 60 * 60 : 0;
  }

  public async save(message: InterpretationMessage) {
    const collection = this.mongoService.getCollection(this.collectionName);
    if (!collection) {
      this.logger.warn(
        `[RequestArchive] MongoDB 미연결 상태 – 요청 ${message.requestId} 저장 실패`
      );
      return;
    }

    await this.ttlManager.ensureIndex(collection, "storedAt", this.ttlSeconds);
    const doc = {
      requestId: message.requestId,
      userId: message.userId,
      username: message.username,
      payload: JSON.stringify(message.payload),
      storedAt: new Date().toISOString(),
      status: "pending",
    };

    await collection.updateOne(
      { requestId: message.requestId },
      { $set: doc },
      { upsert: true }
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
        `[RequestArchive] 요청 ${requestId} 삭제 실패`,
        (error as Error)?.message
      );
    }
  }

}
