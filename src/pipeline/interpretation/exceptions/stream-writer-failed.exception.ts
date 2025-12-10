import { InternalServerErrorException } from "@nestjs/common";

export class StreamWriterFailedException extends InternalServerErrorException {
  constructor(message?: string) {
    super("<!> 해몽 요청을 접수하지 못했습니다. 잠시 후 다시 시도해주세요.");
  }
}
