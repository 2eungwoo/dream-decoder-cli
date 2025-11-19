import { InternalServerErrorException } from '@nestjs/common';

export class OpenAIConfigException extends InternalServerErrorException {
  constructor(message: string) {
    super(`<!> OpenAI 설정 오류: ${message}`);
  }
}
