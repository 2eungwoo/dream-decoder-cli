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
      record.dream.length > +15
        ? `${record.dream.slice(0, 16)}...`
        : record.dream;
    return dto;
  }
}
