export class InterpretationRecordDetailDto {
  id!: string;
  dream!: string;
  emotions?: string[] | null;
  mbti?: string | null;
  extraContext?: string | null;
  interpretation!: string;
  createdAt!: Date;

  public static fromEntity(record: {
    id: string;
    dream: string;
    emotions?: string[] | null;
    mbti?: string | null;
    extraContext?: string | null;
    interpretation: string;
    createdAt: Date;
  }) {
    const dto = new InterpretationRecordDetailDto();
    dto.id = record.id;
    dto.dream = record.dream;
    dto.emotions = record.emotions ?? null;
    dto.mbti = record.mbti ?? null;
    dto.extraContext = record.extraContext ?? null;
    dto.interpretation = record.interpretation;
    dto.createdAt = record.createdAt;
    return dto;
  }
}
