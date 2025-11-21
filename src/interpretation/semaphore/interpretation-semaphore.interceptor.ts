import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, from } from "rxjs";
import { finalize, switchMap } from "rxjs/operators";
import { InterpretationThrottleException } from "../exceptions/interpretation-throttle.exception";
import { InterpretationSemaphoreService } from "./interpretation-semaphore.service";

@Injectable()
export class InterpretationSemaphoreInterceptor implements NestInterceptor {
  constructor(
    private readonly semaphoreService: InterpretationSemaphoreService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return from(this.semaphoreService.acquire()).pipe(
      switchMap((acquired) => {
        if (!acquired) {
          throw new InterpretationThrottleException();
        }

        return next.handle().pipe(
          finalize(async () => {
            await this.semaphoreService.release();
          })
        );
      })
    );
  }
}
