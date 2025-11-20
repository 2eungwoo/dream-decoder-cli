import type { ApiResponse } from "../src/shared/dto/api-response.dto";

const BASE_URL = process.env.API_URL ?? "http://localhost:3000";

export async function postApi<T>(
  route: string,
  payload: unknown,
  options?: { headers?: Record<string, string> }
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
      body: JSON.stringify(payload),
    });
    return (await response.json()) as ApiResponse<T>;
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      message: err?.message ?? "Unknown error",
      code: 0,
      errors: err,
    };
  }
}
