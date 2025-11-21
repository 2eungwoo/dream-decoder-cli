import { Injectable } from "@nestjs/common";
import { RedisService } from "../../infra/redis/redis.service";

const SEMAPHORE_KEY = "interpretation:semaphore";
const SEMAPHORE_LIMIT = Number(process.env.INTERPRET_SEMAPHORE_LIMIT ?? "5");
const SEMAPHORE_TTL = Number(process.env.INTERPRET_SEMAPHORE_TTL ?? "10");

@Injectable()
export class InterpretationSemaphoreService {
  constructor(private readonly redisService: RedisService) {}

  public acquire() {
    return this.redisService.acquireSemaphore(
      SEMAPHORE_KEY,
      SEMAPHORE_LIMIT,
      SEMAPHORE_TTL
    );
  }

  public release() {
    return this.redisService.releaseSemaphore(SEMAPHORE_KEY);
  }
}
