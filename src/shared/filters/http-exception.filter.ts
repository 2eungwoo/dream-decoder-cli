import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseFactory } from '../dto/api-response.dto';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { status, message, errors } = this.normalizeException(exception);

    response
      .status(status)
      .json(ApiResponseFactory.error(message, status, errors));
  }

  private normalizeException(exception: unknown) {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message =
        (typeof response === 'object'
          ? (response as { message?: string | string[] }).message
          : undefined) ?? exception.message;

      return {
        status,
        message: Array.isArray(message) ? message.join(', ') : message,
        errors: response,
      };
    }

    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        errors: undefined,
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      errors: exception,
    };
  }
}
