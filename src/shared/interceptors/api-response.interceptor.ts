import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, ApiResponseFactory } from '../dto/api-response.dto';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse> {
    return next.handle().pipe(
      map((data) => {
        if (this.isApiResponse(data)) {
          return data;
        }

        const message =
          typeof data === 'object' && data && 'message' in data
            ? (data as { message?: string }).message
            : undefined;

        return ApiResponseFactory.success(data, message);
      }),
    );
  }

  private isApiResponse(data: unknown): data is ApiResponse {
    return Boolean(
      data &&
        typeof data === 'object' &&
        'success' in data &&
        typeof (data as { success?: unknown }).success === 'boolean',
    );
  }
}
