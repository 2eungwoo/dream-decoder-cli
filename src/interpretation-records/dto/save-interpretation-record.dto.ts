import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "@nestjs/class-validator";

export class SaveInterpretationRecordDto {
  @IsString()
  @IsNotEmpty()
  dream!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  emotions?: string[];

  @IsOptional()
  @IsString()
  mbti?: string;

  @IsOptional()
  @IsString()
  extraContext?: string;

  @IsString()
  @IsNotEmpty()
  interpretation!: string;

  @IsOptional()
  @IsString()
  userPrompt?: string;
}
