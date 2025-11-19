import { IsNotEmpty, IsString } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  @IsNotEmpty({ message: '<!> 사용자 이름을 입력해주세요.' })
  public username!: string;

  @IsString()
  @IsNotEmpty({ message: '<!> 비밀번호를 입력해주세요.' })
  public password!: string;

  @IsString()
  @IsNotEmpty({ message: '<!> 메시지를 입력해주세요.' })
  public message!: string;
}
