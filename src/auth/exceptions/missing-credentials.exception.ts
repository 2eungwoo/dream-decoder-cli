import { BadRequestException } from '@nestjs/common';

export class MissingCredentialsException extends BadRequestException {
  constructor() {
    super('<!> username/password는 필수입니다.');
  }
}
