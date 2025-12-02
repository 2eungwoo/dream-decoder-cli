import { CallHandler, ExecutionContext } from "@nestjs/common";
import { describe, beforeEach, it, expect, jest } from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import { of, firstValueFrom } from "rxjs";
import { InterpretationDuplicateRequestException } from "../exceptions/interpretation-duplicate-request.exception";
import { InterpretationLockInterceptor } from "./interpretation-lock.interceptor";
import { InterpretationLockService } from "./interpretation-lock.service";
import { INTERPRETATION_IDEMPOTENCY_HEADER } from "./interpretation-lock.constants";
import { InterpretationIdempotencyKeyMissingException } from "../exceptions/interpretation-idempotency-key-missing.exception";

describe("InterpretationLockInterceptor", () => {
  let interceptor: InterpretationLockInterceptor;
  const lockService = {
    acquire: jest.fn(),
    release: jest.fn(),
  } as jest.Mocked<Pick<InterpretationLockService, "acquire" | "release">>;

  const request = {
    user: { id: "user-1" },
    headers: {
      [INTERPRETATION_IDEMPOTENCY_HEADER]: "token-token-token-token-token",
    } as Record<string, string>,
    header(name: string) {
      return this.headers[name];
    },
  };

  const context = {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;

  const next: CallHandler = { handle: jest.fn(() => of("OK")) };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterpretationLockInterceptor,
        {
          provide: InterpretationLockService,
          useValue: lockService,
        },
      ],
    }).compile();

    interceptor = module.get(InterpretationLockInterceptor);
  });

  it("동일 요청 없으면 통과 후 락 해제", async () => {
    // given
    lockService.acquire.mockResolvedValueOnce({
      key: "lock",
      token: "token-token-token-token-token",
    });

    // when
    await firstValueFrom(interceptor.intercept(context, next));

    // then
    expect(next.handle).toHaveBeenCalled();
    expect(lockService.release).toHaveBeenCalledWith({
      key: "lock",
      token: "token-token-token-token-token",
    });
  });

  it("동일 요청 처리 중이면 예외", async () => {
    // given
    lockService.acquire.mockResolvedValueOnce(null);

    // when & then
    await expect(
      firstValueFrom(interceptor.intercept(context, next))
    ).rejects.toBeInstanceOf(InterpretationDuplicateRequestException);
    expect(next.handle).not.toHaveBeenCalled();
    expect(lockService.release).not.toHaveBeenCalled();
  });

  it("idempo key 없으면 예외", () => {
    // given
    const originalHeader = request.header;
    request.header = () => "";

    // when & then
    expect(() => interceptor.intercept(context, next)).toThrow(
      InterpretationIdempotencyKeyMissingException
    );
    expect(lockService.acquire).not.toHaveBeenCalled();
    request.header = originalHeader;
  });
});
