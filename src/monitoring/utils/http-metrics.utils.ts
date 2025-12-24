import { Request } from "express";
import { HttpException } from "@nestjs/common";

export function extractRoute(request: Request) {
  const route = request.route?.path ?? request.url ?? "unknown";
  return route.replace(/\?.*$/, "").toLowerCase();
}

export function resolveStatusCode(error: unknown) {
  if (error instanceof HttpException) {
    return error.getStatus();
  }
  const errorStatus = (error as { status?: number })?.status;
  if (typeof errorStatus === "number" && !Number.isNaN(errorStatus)) {
    return errorStatus;
  }
  return 500;
}
