export interface ApiSuccessResponse<T = undefined> {
  success: true;
  message?: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code: number;
  errors?: unknown;
}

export type ApiResponse<T = undefined> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;

export class ApiResponseFactory {
  public static success<T>(data?: T, message?: string): ApiSuccessResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  public static error(
    message: string,
    code: number,
    errors?: unknown,
  ): ApiErrorResponse {
    return {
      success: false,
      message,
      code,
      errors,
    };
  }
}
