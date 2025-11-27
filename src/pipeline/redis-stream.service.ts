import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { RedisService } from "../infra/redis/redis.service";

interface ReadGroupOptions {
  stream: string;
  group: string;
  consumer: string;
  count: number;
  blockMs: number;
}

interface ClaimIdleOptions {
  stream: string;
  group: string;
  consumer: string;
  minIdleTime: number;
  count: number;
}

@Injectable()
export class RedisStreamService {
  constructor(private readonly redisService: RedisService) {}

  private get client(): Redis {
    return this.redisService.getClient();
  }

  public async append(stream: string, values: Record<string, string>) {
    const entries: string[] = [];
    for (const [key, value] of Object.entries(values)) {
      entries.push(key, value);
    }
    // XADD <stream> * field value ...
    await this.client.xadd(stream, "*", ...entries);
  }

  public async ensureGroup(stream: string, group: string) {
    try {
      // XGROUP CREATE <stream> <group> 0 MKSTREAM
      await this.client.xgroup("CREATE", stream, group, "0", "MKSTREAM");
    } catch (error) {
      if (error instanceof Error && error.message.includes("BUSYGROUP")) {
        return;
      }
      throw error;
    }
  }

  public async readGroup(
    options: ReadGroupOptions
  ): Promise<Array<[string, string[]]> | null> {
    const { stream, group, consumer, count, blockMs } = options;
    // XREADGROUP GROUP <group> <consumer> COUNT n BLOCK ms STREAMS <stream>
    const response = (await this.client.xreadgroup(
      "GROUP",
      group,
      consumer,
      "COUNT",
      count,
      "BLOCK",
      blockMs,
      "STREAMS",
      stream,
      ">"
    )) as [string, [string, string[]][]][] | null;

    if (!response) {
      return null;
    }

    return response[0][1];
  }

  public async claimIdle(
    options: ClaimIdleOptions
  ): Promise<Array<[string, string[]]>> {
    const { stream, group, consumer, minIdleTime, count } = options;
    // XAUTOCLAIM <stream> <group> <consumer> <min-idle> 0-0 COUNT n
    const response = (await this.client.xautoclaim(
      stream,
      group,
      consumer,
      minIdleTime,
      "0-0",
      "COUNT",
      count
    )) as [string, [string, string[]][]];

    return response[1];
  }

  public async ack(stream: string, group: string, id: string) {
    // XACK <stream> <group> <id>
    await this.client.xack(stream, group, id);
  }

  public async delete(stream: string, ...ids: string[]) {
    if (!ids.length) return;
    // XDEL <stream> <id> <id> ...
    await this.client.xdel(stream, ...ids);
  }

  public async reverseRange(
    stream: string,
    count: number
  ): Promise<Array<[string, string[]]>> {
    // XREVRANGE <stream> + - COUNT n
    return (await this.client.xrevrange(
      stream,
      "+",
      "-",
      "COUNT",
      count
    )) as Array<[string, string[]]>;
  }

  public async range(
    stream: string,
    start = "-",
    end = "+"
  ): Promise<Array<[string, string[]]>> {
    // XRANGE <stream> <start> <end>
    return (await this.client.xrange(stream, start, end)) as Array<
      [string, string[]]
    >;
  }
}
