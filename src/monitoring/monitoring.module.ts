import { Global, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MetricsService } from "./metrics.service";
import { MetricsController } from "./metrics.controller";
import { HttpMetricsInterceptor } from "./interceptors/http-metrics.interceptor";
import { RedisStreamMetricsService } from "./redis-stream-metrics.service";
import { RedisModule } from "../infra/redis/redis.module";

@Global()
@Module({
  imports: [RedisModule],
  controllers: [MetricsController],
  providers: [
    MetricsService,
    RedisStreamMetricsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpMetricsInterceptor,
    },
  ],
  exports: [MetricsService],
})
export class MonitoringModule {}
