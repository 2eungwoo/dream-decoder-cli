import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, from } from "rxjs";
import { finalize, switchMap } from "rxjs/operators";
import { RedisService } from "../../infra/redis/redis.service";
import { InterpretationThrottleException } from "../exceptions/interpretation-throttle.exception";

const SEMAPHORE_KEY = "interpretation:semaphore";
const SEMAPHORE_LIMIT = Number(process.env.INTERPRET_SEMAPHORE_LIMIT ?? "5");

@Injectable()
export class InterpretationSemaphoreInterceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const client = this.redisService.getClient();

    return from(this.acquireSlot(client)).pipe(
      switchMap((acquired) => {
        if (!acquired) {
          throw new InterpretationThrottleException();
        }

        return next.handle().pipe(
          finalize(async () => {
            await client.decr(SEMAPHORE_KEY);
          })
        );
      })
    );
  }

  private async acquireSlot(client: ReturnType<RedisService["getClient"]>) {
    const current = await client.incr(SEMAPHORE_KEY);
    if (current === 1) {
      await client.expire(
        SEMAPHORE_KEY,
        Number(process.env.INTERPRET_SEMAPHORE_TTL ?? "10")
      );
    }
    if (current > SEMAPHORE_LIMIT) {
      await client.decr(SEMAPHORE_KEY);
      return false;
    }
    return true;
  }
}
