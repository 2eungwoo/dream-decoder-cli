import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { RedisService } from "../../../infra/redis/redis.service";

@Injectable()
export class InterpretationStatusRepository {
  constructor(private readonly redisService: RedisService) {}

  private get client(): Redis {
    return this.redisService.getClient();
  }

  public async initialize(key: string, fields: Record<string, string>) {
    await this.client.hset(key, fields);
  }

  public async update(key: string, fields: Record<string, string>) {
    await this.client.hset(key, fields);
  }

  public async incrementRetry(key: string) {
    return this.client.hincrby(key, "retryCount", 1);
  }

  public async findRaw(key: string) {
    return this.client.hgetall(key);
  }

  public async touch(key: string, ttlSeconds: number) {
    await this.client.expire(key, ttlSeconds);
  }
}
