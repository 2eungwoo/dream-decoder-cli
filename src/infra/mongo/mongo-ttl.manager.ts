import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class MongoTtlManager {
  private readonly logger = new Logger(MongoTtlManager.name);
  private readonly ensuredIndexes = new Set<string>();

  public async ensureIndex(
    collection: any,
    field: string,
    ttlSeconds: number
  ) {
    if (!collection || ttlSeconds <= 0) {
      return;
    }

    const key = `${collection.collectionName}:${field}`;
    if (this.ensuredIndexes.has(key)) {
      return;
    }

    try {
      await collection.createIndex(
        { [field]: 1 },
        { expireAfterSeconds: ttlSeconds }
      );
      this.ensuredIndexes.add(key);
    } catch (error) {
      this.logger.warn(
        `[MongoTTL] ${collection.collectionName} 인덱스 생성 실패`,
        (error as Error)?.message
      );
    }
  }
}
