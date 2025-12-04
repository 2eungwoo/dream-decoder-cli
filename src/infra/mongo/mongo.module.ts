import { Global, Module } from "@nestjs/common";
import { MongoService } from "./mongo.service";
import { MongoTtlManager } from "./mongo-ttl.manager";

@Global()
@Module({
  providers: [MongoService, MongoTtlManager],
  exports: [MongoService, MongoTtlManager],
})
export class MongoModule {}
