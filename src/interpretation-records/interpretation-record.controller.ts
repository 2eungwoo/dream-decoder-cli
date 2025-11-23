import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { ApiResponseFactory } from "../shared/dto/api-response.dto";
import { InterpretAuthGuard } from "../interpretation/guards/interpret-auth.guard";
import { SaveInterpretationRecordDto } from "./dto/save-interpretation-record.dto";
import { InterpretationRecordService } from "./interpretation-record.service";

@Controller("interpret/logs")
@UseGuards(InterpretAuthGuard)
export class InterpretationRecordController {
  constructor(
    private readonly interpretationRecordService: InterpretationRecordService
  ) {}

  @Post()
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

  @Get(":id")
  public async findDetail(@Param("id") id: string, @Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException("<!> 사용자 인증이 필요합니다.");
    }

    const record = await this.interpretationRecordService.findRecord(
      req.user.id,
      id
    );
    if (!record) {
      throw new NotFoundException("<!> 저장된 해몽을 찾을 수 없습니다.");
    }

    return ApiResponseFactory.success(record);
  }
}
