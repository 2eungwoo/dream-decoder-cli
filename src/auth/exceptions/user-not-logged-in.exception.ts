import { UnauthorizedException } from '@nestjs/common';

export class UserNotLoggedInException extends UnauthorizedException {
  constructor() {
    super('<!> 로그인도 안하고 로그아웃을??');
  }
}
