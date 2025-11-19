import { InternalServerErrorException } from '@nestjs/common';

export class EmbeddingApiException extends InternalServerErrorException {
  constructor(message: string, details?: unknown) {
    super({
      message: `<!> 임베딩 API 오류: ${message}`,
      details,
    });
  }
}
