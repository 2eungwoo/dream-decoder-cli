import { UnauthorizedException } from '@nestjs/common';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('<!> username/password를 확인해주세요.');
  }
}
