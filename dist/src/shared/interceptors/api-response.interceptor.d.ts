import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiResponse } from '../dto/api-response.dto';
export declare class ApiResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse>;
    private isApiResponse;
}
