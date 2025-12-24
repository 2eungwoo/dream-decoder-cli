import { Controller, Get, Header, Res } from "@nestjs/common";
import { Response } from "express";
import { MetricsService } from "./metrics.service";

@Controller()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get("metrics")
  @Header("Cache-Control", "no-store")
  public async getMetrics(@Res({ passthrough: true }) response: Response) {
    response.setHeader("Content-Type", this.metricsService.getContentType());
    return this.metricsService.getMetrics();
  }
}
