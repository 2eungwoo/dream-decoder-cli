import { Injectable } from "@nestjs/common";
import { InterpretationMessage } from "../messages/interfaces/message.types";
import { INTERPRETATION_DLQ_KEY } from "../config/storage.config";
import { RedisStreamService } from "../../redis-stream.service";

@Injectable()
export class InterpretationDlqWriter {
  constructor(private readonly redisStream: RedisStreamService) {}

  public async write(message: InterpretationMessage, reason: string) {
    await this.redisStream.append(INTERPRETATION_DLQ_KEY, {
      requestId: message.requestId,
      userId: message.userId,
      username: message.username,
      payload: JSON.stringify(message.payload),
      failedAt: new Date().toISOString(),
      errorMessage: reason,
    });
  }
}
