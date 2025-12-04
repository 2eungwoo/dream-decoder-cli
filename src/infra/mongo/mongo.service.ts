import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MongoService.name);
  private client: any;
  private db: any;

  async onModuleInit() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      this.logger.warn(
        "[Mongo] MONGO_URI 설정 누락"
      );
      return;
    }

    try {
      const mongodb = require("mongodb");
      const MongoClient =
        mongodb?.MongoClient ?? mongodb?.default?.MongoClient ?? mongodb;
      this.client = new MongoClient(uri);
      await this.client.connect();

      const dbName = process.env.MONGO_DB ?? "dream-decoder";
      this.db = this.client.db(dbName);
      this.logger.log(`[Mongo] ${dbName} 연결 완료`);
    } catch (error) {
      this.logger.error(
        "[Mongo] MongoDB 연결 실패",
        (error as Error)?.message
      );
      this.client = undefined;
      this.db = undefined;
    }
  }

  public getCollection(name: string) {
    if (!this.db) {
      return null;
    }

    return this.db.collection(name);
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.close();
    }
  }
}
