import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Response, Request } from "express";
import { Observable, catchError, tap, throwError } from "rxjs";
import { MetricsService } from "../metrics.service";
import { hrtimeSeconds } from "../utils/metrics-time.utils";
import { extractRoute, resolveStatusCode } from "../utils/http-metrics.utils";

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    if (!request || !response) {
      return next.handle();
    }

    const start = process.hrtime.bigint();
    const method = (request.method ?? "UNKNOWN").toUpperCase();
    const route = extractRoute(request);

    const record = (statusCode: number) => {
      this.metricsService.observeHttpRequest(
        method,
        route,
        statusCode,
        hrtimeSeconds(start)
      );
    };

    return next.handle().pipe(
      tap(() => {
        record(response.statusCode ?? 0);
      }),
      catchError((error) => {
        record(resolveStatusCode(error));
        return throwError(() => error);
      })
    );
  }
}
