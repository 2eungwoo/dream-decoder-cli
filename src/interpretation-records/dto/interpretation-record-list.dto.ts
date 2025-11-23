const MAX_PREVIEW_LENGTH = 16;

export class InterpretationRecordListDto {
  id!: string;
  dream!: string;
  createdAt!: Date;

  public static fromRecord(record: {
    id: string;
    dream: string;
    createdAt: Date;
  }) {
    const dto = new InterpretationRecordListDto();
    dto.id = record.id;
    dto.createdAt = record.createdAt;
    dto.dream =
      record.dream.length > MAX_PREVIEW_LENGTH
        ? `${record.dream.slice(0, MAX_PREVIEW_LENGTH)}...`
        : record.dream;
    return dto;
  }
}
