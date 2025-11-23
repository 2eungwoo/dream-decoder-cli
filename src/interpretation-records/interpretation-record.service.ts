import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InterpretationRecord } from "./interpretation-record.entity";
import { SaveInterpretationRecordDto } from "./dto/save-interpretation-record.dto";
import { InterpretationRecordDetailDto } from "./dto/interpretation-record-detail.dto";
import { InterpretationRecordValidator } from "./interpretation-record.validator";

@Injectable()
export class InterpretationRecordService {
  constructor(
    @InjectRepository(InterpretationRecord)
    private readonly recordsRepository: Repository<InterpretationRecord>,
    private readonly recordValidator: InterpretationRecordValidator
  ) {}

  public async saveRecord(
    userId: string,
    payload: SaveInterpretationRecordDto
  ) {
    const record = this.recordsRepository.create({
      userId,
      dream: payload.dream,
      emotions: payload.emotions,
      mbti: payload.mbti,
      extraContext: payload.extraContext,
      interpretation: payload.interpretation,
      userPrompt: payload.userPrompt,
    });

    const saved = await this.recordsRepository.save(record);
    return saved.id;
  }

  public async findRecord(userId: string, recordId: string) {
    const record = await this.recordsRepository.findOne({
      where: { userId, id: recordId },
      select: [
        "id",
        "dream",
        "emotions",
        "mbti",
        "extraContext",
        "interpretation",
        "createdAt",
      ],
    });

    const responseDto = this.recordValidator.validExists(record);
    return InterpretationRecordDetailDto.fromEntity(responseDto);
  }
}
