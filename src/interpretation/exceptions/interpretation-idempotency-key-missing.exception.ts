import { BadRequestException } from "@nestjs/common";

export class InterpretationIdempotencyKeyMissingException extends BadRequestException {
  constructor() {
    super("<!> X-Idempotency-Key 헤더를 포함해주세요.");
  }
}
