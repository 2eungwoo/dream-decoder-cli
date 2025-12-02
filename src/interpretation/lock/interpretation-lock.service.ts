import { Injectable } from "@nestjs/common";
import { RedisLockService } from "../../infra/redis/redis-lock.service";
import { INTERPRETATION_LOCK_TTL_SECONDS } from "./interpretation-lock.constants";
import { InterpretationLockKeyFactory } from "./interpretation-lock-key.factory";

export interface InterpretationLockHandle {
  key: string;
  token: string;
}

@Injectable()
export class InterpretationLockService {
  constructor(private readonly redisLock: RedisLockService) {}

  public async acquire(userId: string, idempotencyKey: string) {
    const key = InterpretationLockKeyFactory.create(userId, idempotencyKey);
    const token = await this.redisLock.acquire(
      key,
      INTERPRETATION_LOCK_TTL_SECONDS
    );

    if (!token) {
      return null;
    }

    return { key, token };
  }

  public async release(handle: InterpretationLockHandle | null) {
    if (!handle) {
      return;
    }

    await this.redisLock.release(handle.key, handle.token);
  }
}
