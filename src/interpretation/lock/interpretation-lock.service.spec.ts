import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { InterpretationLockService } from "./interpretation-lock.service";
import { RedisLockService } from "../../infra/redis/redis-lock.service";
import { INTERPRETATION_LOCK_TTL_SECONDS } from "./interpretation-lock.constants";
import { InterpretationLockKeyFactory } from "./interpretation-lock-key.factory";

describe("InterpretationLockService", () => {
  let redisLock: jest.Mocked<Pick<RedisLockService, "acquire" | "release">>;
  let service: InterpretationLockService;
  const TOKEN = `token-token-token-token-token`;

  beforeEach(() => {
    redisLock = {
      acquire: jest.fn(),
      release: jest.fn(),
    };
    service = new InterpretationLockService(
      redisLock as unknown as RedisLockService
    );
  });

  it("분산락 획득 성공해야 lease 반환", async () => {
    // given & when
    redisLock.acquire.mockResolvedValueOnce(TOKEN);
    const lease = await service.acquire("user-1", "idem-key");
    const expectedKey = InterpretationLockKeyFactory.create(
      "user-1",
      "idem-key"
    );

    // then
    expect(redisLock.acquire).toHaveBeenCalledWith(
      expectedKey,
      INTERPRETATION_LOCK_TTL_SECONDS
    );
    expect(lease).toEqual({ key: expectedKey, token: TOKEN });
  });

  it("락 획득 실패 시에는 null 리턴", async () => {
    // given & when
    redisLock.acquire.mockResolvedValueOnce(null);
    const lease = await service.acquire("user-1", "idem-key");

    // then
    expect(lease).toBeNull();
  });

  it("release에 lease로 null 들어오면 아무것도 안함", async () => {
    // when
    await service.release(null);

    // then
    expect(redisLock.release).not.toHaveBeenCalled();
  });

  it("lock release되면 RedisLockService에 lease 전달해서 호출", async () => {
    // given
    const lease = {
      key: InterpretationLockKeyFactory.create("user-1", "idem-key"),
      token: TOKEN,
    };

    // when
    await service.release(lease);

    // then
    expect(redisLock.release).toHaveBeenCalledWith(lease.key, lease.token);
  });
});
