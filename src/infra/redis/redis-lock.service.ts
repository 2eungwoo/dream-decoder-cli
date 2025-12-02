import { Injectable, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "crypto";
import type { Redis } from "ioredis";
import { RedisService } from "./redis.service";

@Injectable()
export class RedisLockService implements OnModuleInit {
  private client!: Redis;

  constructor(private readonly redisService: RedisService) {}

  async onModuleInit() {
    this.client = this.redisService.getClient();
  }

  public async acquire(key: string, ttlSeconds: number) {
    const token = randomUUID();
    const result = await this.client.set(
      key,
      token,
      "EX",
      ttlSeconds,
      "NX"
    );
    return result === "OK" ? token : null;
  }

  public async release(key: string, token: string) {
    const releaseScript = `
      if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
      end
      return 0
    `;

    await this.client.eval(releaseScript, 1, key, token);
  }
}
