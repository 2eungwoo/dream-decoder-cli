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
export type ApiResponse<T = undefined> = ApiSuccessResponse<T> | ApiErrorResponse;
export declare class ApiResponseFactory {
    static success<T>(data?: T, message?: string): ApiSuccessResponse<T>;
    static error(message: string, code: number, errors?: unknown): ApiErrorResponse;
}
