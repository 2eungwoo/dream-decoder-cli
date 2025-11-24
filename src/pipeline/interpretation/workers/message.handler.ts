import { Injectable, Logger } from "@nestjs/common";
import { InterpretationStatusStore } from "../status/status.store";
import { InterpretationProcessor } from "./processor.service";
import { InterpretationStreamWriter } from "../streams/stream.writer";
import { InterpretationDlqWriter } from "../dlq/dlq.writer";
import {
  InterpretationMessage,
} from "../messages/message.types";
import { InterpretationMessageFactory } from "../messages/message.factory";
import { INTERPRETATION_WORKER_MAX_RETRY } from "../config/worker.config";

@Injectable()
export class InterpretationMessageHandler {
  private readonly logger = new Logger(InterpretationMessageHandler.name);

  constructor(
    private readonly statusStore: InterpretationStatusStore,
    private readonly processor: InterpretationProcessor,
    private readonly streamWriter: InterpretationStreamWriter,
    private readonly dlqWriter: InterpretationDlqWriter,
    private readonly messageFactory: InterpretationMessageFactory
  ) {}

  public async handle(message: InterpretationMessage) {
    await this.statusStore.markRunning(message.requestId);
    try {
      await this.processor.process(message.requestId, message.payload);
    } catch (error) {
      await this.handleFailure(message, error as Error);
    }
  }

  private async handleFailure(
    message: InterpretationMessage,
    error: Error
  ) {
    const reason =
      error?.message ??
      "<!> 해몽 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
    const nextRetry = message.retryCount + 1;

    if (nextRetry > INTERPRETATION_WORKER_MAX_RETRY) {
      await this.statusStore.markFailed(message.requestId, reason);
      await this.dlqWriter.write(message, reason);
      this.logger.error(
        `Request ${message.requestId} moved to DLQ after ${nextRetry} attempts.`
      );
      return;
    }

    await this.statusStore.incrementRetry(message.requestId);
    await this.statusStore.markPending(message.requestId, reason);
    const retryMessage = this.messageFactory.withRetry(message, nextRetry);
    await this.streamWriter.write(retryMessage);
  }
}
