import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InterpretationRecord } from "./interpretation-record.entity";
import { SaveInterpretationRecordDto } from "./dto/save-interpretation-record.dto";
import { InterpretationRecordDetailDto } from "./dto/interpretation-record-detail.dto";
import { InterpretationRecordListDto } from "./dto/interpretation-record-list.dto";
import { InterpretationRecordValidator } from "./exceptions/interpretation-record.validator";

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

  public async listRecords(userId: string) {
    const records = await this.recordsRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
      select: ["id", "dream", "createdAt"],
    });

    return records.map((record) =>
      InterpretationRecordListDto.fromRecord(record)
    );
  }
}
