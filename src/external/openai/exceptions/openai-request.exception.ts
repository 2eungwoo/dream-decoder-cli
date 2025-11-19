import { InternalServerErrorException } from '@nestjs/common';

export class OpenAIRequestException extends InternalServerErrorException {
  constructor(message: string, details?: unknown) {
    super({
      message: `<!> OpenAI 요청 실패: ${message}`,
      details,
    });
  }
}
