import { BadRequestException } from '@nestjs/common';

export class ChatMessageRequiredException extends BadRequestException {
  constructor() {
    super('<!> 대화 내용을 입력해주세요.');
  }
}
