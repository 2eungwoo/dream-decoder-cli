import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";

export interface RequestUser {
  id: string;
  username: string;
}

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): RequestUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as RequestUser | undefined;
    if (!user) {
      throw new UnauthorizedException("<!> 사용자 인증이 필요합니다.");
    }
    return user;
  }
);
