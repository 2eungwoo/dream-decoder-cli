import type { ApiResponse } from '../src/shared/dto/api-response.dto';
export declare function postApi<T extends Record<string, unknown>>(route: string, payload: Record<string, unknown>): Promise<ApiResponse<T>>;
