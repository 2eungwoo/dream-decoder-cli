import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InterpretationRecord } from "./interpretation-record.entity";
import { InterpretationRecordService } from "./interpretation-record.service";
import { InterpretationRecordController } from "./interpretation-record.controller";
import { AuthModule } from "../auth/auth.module";
import { InterpretAuthGuard } from "../interpretation/guards/interpret-auth.guard";
import { InterpretationRecordValidator } from "./interpretation-record.validator";

@Module({
  imports: [TypeOrmModule.forFeature([InterpretationRecord]), AuthModule],
  controllers: [InterpretationRecordController],
  providers: [
    InterpretationRecordService,
    InterpretationRecordValidator,
    InterpretAuthGuard,
  ],
})
export class InterpretationRecordModule {}
