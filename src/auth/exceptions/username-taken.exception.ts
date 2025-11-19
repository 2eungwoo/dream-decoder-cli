import { BadRequestException } from '@nestjs/common';

export class UsernameTakenException extends BadRequestException {
  constructor(username: string) {
    super(`<!> ${username}은(는) 이미 사용 중입니다.`);
  }
}
