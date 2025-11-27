import { Injectable } from "@nestjs/common";
import { InterpretationService } from "../../../interpretation/interpretation.service";
import { InterpretationStatusStore } from "../status/status.store";
import { InterpretationPayload } from "../messages/interfaces/message.types";
import { InterpretationStreamLogService } from "../logging/stream-log.service";

@Injectable()
export class InterpretationProcessor {
  private readonly component = "Processor";

  constructor(
    private readonly interpretationService: InterpretationService,
    private readonly statusStore: InterpretationStatusStore,
    private readonly streamLogger: InterpretationStreamLogService
  ) {}

  public async process(requestId: string, payload: InterpretationPayload) {
    const result =
      await this.interpretationService.generateInterpretation(payload);
    await this.statusStore.markCompleted(requestId, result.interpretation, {
      fromCache: result.fromCache,
    });
    this.streamLogger.debug(
      this.component,
      `해몽 요청 ${requestId} ${result.fromCache ? "cache-hit" : "llm-call"} (payload dream length: ${
        payload.dream?.length ?? 0
      })`
    );
  }
}
