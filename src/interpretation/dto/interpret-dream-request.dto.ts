/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class InterpretDreamRequestDto {
  @IsString()
  @IsNotEmpty({ message: '<!> 꿈 내용을 입력해주세요.' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  dream!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  emotions?: string[];

  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @Matches(/^(?:[EI][SN][TF][JP])$/i, {
    message: '<!> 올바른 MBTI 유형을 입력해주세요.',
  })
  mbti?: string;

  @IsOptional()
  @IsString()
  extraContext?: string;
}
