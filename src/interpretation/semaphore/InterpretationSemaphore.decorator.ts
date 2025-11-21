import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { InterpretationSemaphoreInterceptor } from "./interpretation-semaphore.interceptor";

export function UseInterpretationSemaphore() {
  return applyDecorators(UseInterceptors(InterpretationSemaphoreInterceptor));
}
