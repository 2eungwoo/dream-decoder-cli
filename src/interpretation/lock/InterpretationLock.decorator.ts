import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { InterpretationLockInterceptor } from "./interpretation-lock.interceptor";

export function UseInterpretationLock() {
  return applyDecorators(UseInterceptors(InterpretationLockInterceptor));
}
