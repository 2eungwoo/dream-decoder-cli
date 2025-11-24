import { Injectable } from "@nestjs/common";
import { InterpretationService } from "../../../interpretation/interpretation.service";
import { InterpretationStatusStore } from "../status/status.store";
import { InterpretationPayload } from "../messages/message.types";

@Injectable()
export class InterpretationProcessor {
  constructor(
    private readonly interpretationService: InterpretationService,
    private readonly statusStore: InterpretationStatusStore
  ) {}

  public async process(requestId: string, payload: InterpretationPayload) {
    const result = await this.interpretationService.generateInterpretation(
      payload
    );
    await this.statusStore.markCompleted(requestId, result.interpretation, {
      fromCache: result.fromCache,
    });
  }
}
