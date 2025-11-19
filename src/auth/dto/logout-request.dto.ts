/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutRequestDto {
  @IsString()
  @IsNotEmpty({ message: '<!> 사용자 이름을 입력해주세요.' })
  username!: string;

  @IsString()
  @IsNotEmpty({ message: '<!> 비밀번호를 입력해주세요.' })
  password!: string;
}
