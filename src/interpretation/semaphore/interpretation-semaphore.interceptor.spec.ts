import { CallHandler, ExecutionContext } from "@nestjs/common";
import { describe, beforeEach, it, expect, jest } from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import { of, firstValueFrom } from "rxjs";
import { InterpretationSemaphoreInterceptor } from "./interpretation-semaphore.interceptor";
import { InterpretationThrottleException } from "../exceptions/interpretation-throttle.exception";
import { InterpretationSemaphoreService } from "./interpretation-semaphore.service";

describe("InterpretationSemaphoreInterceptor", () => {
  let interceptor: InterpretationSemaphoreInterceptor;

  // redis service mocking
  // 세마포어 획득/해제만 가져옴
  const semaphoreService = {
    // ioredis의 각 연산 리턴을 jest 러너의 Mock 타입으로 맞춰주기
    // mockResolvedValueOnce 사용에서 요구함
    acquire: jest.fn() as jest.MockedFunction<any>,
    release: jest.fn() as jest.MockedFunction<any>,
  };
  const context = {} as ExecutionContext;

  /*  
    인터셉터의 다음 실행 mocking
    intercept(context, next) {
      return next.handle();   // -> Observable
      // controller or 다음 interceptor 으로 가는걸 ok처리
    }
  
    intercept(context, next) 내부에서 next.handle()을 호출해야
    controller 혹은 다음 interceptor 로직이 실행되니까
    handle()이 호출됐는지만 확인하면 pass 여부를 검증할 수 있음
  */
  const next: CallHandler = { handle: jest.fn(() => of("OK")) };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterpretationSemaphoreInterceptor,
        {
          provide: InterpretationSemaphoreService,
          useValue: semaphoreService,
        },
      ],
    }).compile();

    interceptor = module.get(InterpretationSemaphoreInterceptor);
  });

  it("세마포어 허용량 이내면 pass", async () => {
    semaphoreService.acquire.mockResolvedValueOnce(true);

    await firstValueFrom(interceptor.intercept(context, next));

    expect(next.handle).toHaveBeenCalled();
    expect(semaphoreService.release).toHaveBeenCalled();
  });

  it("세마포어 획득 실패 시 InterpretationThrottleException 발생", async () => {
    semaphoreService.acquire.mockResolvedValueOnce(false);

    await expect(
      firstValueFrom(interceptor.intercept(context, next))
    ).rejects.toBeInstanceOf(InterpretationThrottleException);
    expect(next.handle).not.toHaveBeenCalled();
  });
});
