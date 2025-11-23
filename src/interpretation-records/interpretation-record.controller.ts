import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { ApiResponseFactory } from "../shared/dto/api-response.dto";
import { InterpretAuthGuard } from "../interpretation/guards/interpret-auth.guard";
import { SaveInterpretationRecordDto } from "./dto/save-interpretation-record.dto";
import { InterpretationRecordService } from "./interpretation-record.service";

@Controller()
@UseGuards(InterpretAuthGuard)
export class InterpretationRecordController {
  constructor(
    private readonly interpretationRecordService: InterpretationRecordService
  ) {}

  @Post("interpret/logs")
  public async saveInterpretation(
    @Body() payload: SaveInterpretationRecordDto,
    @Req() req: Request
  ) {
    if (!req.user) {
      throw new UnauthorizedException("<!> 사용자 인증이 필요합니다.");
    }

    const savedId = await this.interpretationRecordService.saveRecord(
      req.user.id,
      payload
    );
    return ApiResponseFactory.success(
      { id: savedId },
      "해몽 기록이 저장되었습니다."
    );
  }

  @Get("interpret/logs")
  public async listInterpretations(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException(
        "<!> 먼저 login 명령으로 로그인 해주세요."
      );
    }

    const records = await this.interpretationRecordService.listRecords(
      req.user.id
    );
    return ApiResponseFactory.success(records);
  }

  @Get("interpret/logs/:id")
  public async findDetail(@Param("id") id: string, @Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException("<!> 사용자 인증이 필요합니다.");
    }

    const record = await this.interpretationRecordService.findRecord(
      req.user.id,
      id
    );

    return ApiResponseFactory.success(record);
  }
}
