import { Injectable } from "@nestjs/common";
import {
  Counter,
  Gauge,
  Histogram,
  Registry,
  collectDefaultMetrics,
} from "prom-client";

@Injectable()
export class MetricsService {
  private readonly registry = new Registry();
  private readonly httpRequestDuration: Histogram<"method" | "route" | "status_code">;
  private readonly httpRequestCounter: Counter<"method" | "route" | "status_code">;
  private readonly interpretationPublishSuccess: Counter<"status">;
  private readonly streamBacklogGauge: Gauge;
  private readonly streamPendingGauge: Gauge;

  constructor() {
    collectDefaultMetrics({
      register: this.registry,
      prefix: "dream_decoder_",
    });

    this.httpRequestDuration = new Histogram({
      name: "dream_decoder_http_request_duration_seconds",
      help: "API HTTP 요청 처리 지연 시간(초)",
      labelNames: ["method", "route", "status_code"],
      buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10],
      registers: [this.registry],
    });

    this.httpRequestCounter = new Counter({
      name: "dream_decoder_http_requests_total",
      help: "API가 처리한 HTTP 요청 수",
      labelNames: ["method", "route", "status_code"],
      registers: [this.registry],
    });

    this.interpretationPublishSuccess = new Counter({
      name: "dream_decoder_stream_publish_total",
      help: "Redis Stream에 적재된 해몽 요청 수",
      labelNames: ["status"],
      registers: [this.registry],
    });

    this.streamBacklogGauge = new Gauge({
      name: "dream_decoder_stream_backlog",
      help: "Redis Stream backlog 길이",
      registers: [this.registry],
    });

    this.streamPendingGauge = new Gauge({
      name: "dream_decoder_stream_pending",
      help: "해몽 consumer 그룹의 미처리 항목 수",
      registers: [this.registry],
    });
  }

  public observeHttpRequest(
    method: string,
    route: string,
    statusCode: number,
    durationSeconds: number
  ) {
    const labels = {
      method,
      route,
      status_code: statusCode.toString(),
    };
    this.httpRequestDuration.observe(labels, durationSeconds);
    this.httpRequestCounter.inc(labels);
  }

  public incrementInterpretationRequestPublished() {
    this.interpretationPublishSuccess.inc({ status: "success" });
  }

  public incrementInterpretationRequestFailed() {
    this.interpretationPublishSuccess.inc({ status: "failed" });
  }

  public setInterpretationStreamBacklog(length: number) {
    this.streamBacklogGauge.set(length);
  }

  public setInterpretationPendingMessages(pending: number) {
    this.streamPendingGauge.set(pending);
  }

  public async getMetrics() {
    return this.registry.metrics();
  }

  public getContentType() {
    return this.registry.contentType;
  }
}
