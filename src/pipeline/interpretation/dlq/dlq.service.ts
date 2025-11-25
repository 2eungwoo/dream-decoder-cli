import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Redis } from "ioredis";
import { RedisService } from "../../../infra/redis/redis.service";
import { INTERPRETATION_DLQ_KEY } from "../config/storage.config";
import { InterpretationRequestPublisher } from "../publisher/request.publisher";
import { InterpretationUserContext } from "../messages/types/message.types";
import { FailedEntry } from "./interfaces/failed-entry.interface";
import { DlqEntryParser } from "./helpers/dlq-entry.parser";

@Injectable()
export class InterpretationDlqService {
  private readonly parser = new DlqEntryParser();

  constructor(
    private readonly redisService: RedisService,
    private readonly requestPublisher: InterpretationRequestPublisher
  ) {}

  private get client(): Redis {
    return this.redisService.getClient();
  }

  public async listByUser(userId: string, limit = 50): Promise<FailedEntry[]> {
    const entries = await this.client.xrevrange(
      INTERPRETATION_DLQ_KEY,
      "+",
      "-",
      "COUNT",
      limit
    );
    return entries
      .map(([streamId, fields]) => this.parser.parse(streamId, fields))
      .filter((entry): entry is FailedEntry => Boolean(entry))
      .filter((entry): entry is FailedEntry => Boolean(entry))
      .filter((entry) => entry.userId === userId);
  }

  public async retryEntry(
    user: InterpretationUserContext,
    requestId: string
  ): Promise<string> {
    const entry = await this.findEntryByRequestId(requestId);
    if (!entry) {
      throw new NotFoundException("<!> 실패한 요청을 찾을 수 없습니다.");
    }
    if (entry.userId !== user.id) {
      throw new ForbiddenException("<!> 자신의 요청만 재시도할 수 있습니다.");
    }

    const { requestId: newRequestId } = await this.requestPublisher.publish(
      user,
      entry.payload
    );

    await this.client.xdel(INTERPRETATION_DLQ_KEY, entry.streamId);
    return newRequestId;
  }

  private async findEntryByRequestId(
    requestId: string
  ): Promise<FailedEntry | undefined> {
    const entries = await this.client.xrange(INTERPRETATION_DLQ_KEY, "-", "+");
    return (
      entries
        .map(([streamId, fields]) => this.parser.parse(streamId, fields))
        .find((entry) => entry?.requestId === requestId) || undefined
    );
  }
}
