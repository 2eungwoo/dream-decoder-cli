import { Injectable } from "@nestjs/common";
import { INTERPRETATION_DLQ_KEY } from "../config/storage.config";
import { InterpretationRequestPublisher } from "../publisher/request.publisher";
import { InterpretationUserContext } from "../messages/interfaces/message.types";
import { FailedEntry } from "./interfaces/failed-entry.interface";
import { DlqEntryParser } from "./helpers/dlq-entry.parser";
import { DlqValidator } from "./validation/dlq.validator";
import { RedisStreamService } from "../../redis-stream.service";

@Injectable()
export class InterpretationDlqService {
  constructor(
    private readonly redisStream: RedisStreamService,
    private readonly requestPublisher: InterpretationRequestPublisher,
    private readonly validator: DlqValidator,
    private readonly parser: DlqEntryParser
  ) {}

  public async listByUser(userId: string, limit = 50): Promise<FailedEntry[]> {
    const entries = await this.redisStream.reverseRange(
      INTERPRETATION_DLQ_KEY,
      limit
    );
    return entries
      .map(([streamId, fields]) => this.parser.parse(streamId, fields))
      .filter((entry): entry is FailedEntry => Boolean(entry))
      .filter((entry) => entry.userId === userId);
  }

  public async retryEntry(
    user: InterpretationUserContext,
    requestId: string
  ): Promise<string> {
    const entry = await this.findEntryByRequestId(requestId);
    this.validator.validateEntryExists(entry);
    this.validator.validateOwner(entry, user.id);

    const { requestId: newRequestId } = await this.requestPublisher.publish(
      user,
      entry.payload
    );

    await this.redisStream.delete(INTERPRETATION_DLQ_KEY, entry.streamId);
    return newRequestId;
  }

  private async findEntryByRequestId(
    requestId: string
  ): Promise<FailedEntry | undefined> {
    const entries = await this.redisStream.range(
      INTERPRETATION_DLQ_KEY,
      "-",
      "+"
    );
    return (
      entries
        .map(([streamId, fields]) => this.parser.parse(streamId, fields))
        .find((entry) => entry?.requestId === requestId) || undefined
    );
  }
}
