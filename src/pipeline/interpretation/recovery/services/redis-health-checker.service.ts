import { Injectable, Logger } from "@nestjs/common";
import { RecoveryFailureCode } from "../recovery.types";
import {RedisService} from "../../../../infra/redis/redis.service";

@Injectable()
export class RedisHealthChecker {
  private readonly logger = new Logger(RedisHealthChecker.name);

  constructor(private readonly redisService: RedisService) {}

  public async isAvailable(): Promise<boolean> {
    try {
      await this.redisService.getClient().ping();
      return true;
    } catch (error) {
      this.logger.warn(
        "[RedisHealthChecker] Redis ping 실패로 재발행을 건너뜁니다.",
        (error as Error)?.message
      );
      return false;
    }
  }

  public failureReason(): RecoveryFailureCode {
    return RecoveryFailureCode.REDIS_UNAVAILABLE;
  }
}
