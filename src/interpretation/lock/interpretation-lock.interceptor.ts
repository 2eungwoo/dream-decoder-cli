import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { Observable, from } from "rxjs";
import { finalize, switchMap } from "rxjs/operators";
import { InterpretationDuplicateRequestException } from "../exceptions/interpretation-duplicate-request.exception";
import { InterpretationIdempotencyKeyMissingException } from "../exceptions/interpretation-idempotency-key-missing.exception";
import { INTERPRETATION_IDEMPOTENCY_HEADER } from "./interpretation-lock.constants";
import { InterpretationLockService } from "./interpretation-lock.service";

@Injectable()
export class InterpretationLockInterceptor implements NestInterceptor {
  constructor(private readonly lockService: InterpretationLockService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { id: string } | undefined;
    if (!user?.id) {
      throw new UnauthorizedException("<!> 사용자 인증이 필요합니다.");
    }
    const idempotencyKey = request.header(INTERPRETATION_IDEMPOTENCY_HEADER);
    if (!idempotencyKey?.trim()) {
      throw new InterpretationIdempotencyKeyMissingException();
    }

    return from(
      this.lockService.acquire(user.id, idempotencyKey.trim())
    ).pipe(
      switchMap((handle) => {
        if (!handle) {
          throw new InterpretationDuplicateRequestException();
        }

        return next.handle().pipe(
          finalize(async () => {
            await this.lockService.release(handle);
          })
        );
      })
    );
  }
}
