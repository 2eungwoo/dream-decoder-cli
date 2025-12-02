import { Global, Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { RedisSemaphoreService } from "./redis-semaphore.service";
import { RedisLockService } from "./redis-lock.service";

@Global()
@Module({
  providers: [RedisService, RedisSemaphoreService, RedisLockService],
  exports: [RedisService, RedisSemaphoreService, RedisLockService],
})
export class RedisModule {}
