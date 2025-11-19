import { BadRequestException } from '@nestjs/common';

export class InvalidDreamException extends BadRequestException {
  constructor() {
    super('<!> 꿈 내용을 입력해주세요.');
  }
}
