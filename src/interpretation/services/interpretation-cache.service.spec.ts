import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { InterpretationCacheService } from "./interpretation-cache.service";

describe("InterpretationCacheService", () => {
  const originalTtl = process.env.INTERPRET_CACHE_TTL_MS;

  afterEach(() => {
    process.env.INTERPRET_CACHE_TTL_MS = originalTtl;
    jest.useRealTimers();
  });

  it("stores and retrieves cached interpretation", () => {
    const cache = new InterpretationCacheService();
    const key = cache.createKey({ dream: "테스트" });

    expect(cache.get(key)).toBeNull();
    cache.set(key, "cached interpretation");

    expect(cache.get(key)).toBe("cached interpretation");
  });

  it("evicts expired cache", () => {
    process.env.INTERPRET_CACHE_TTL_MS = "10";
    jest.useFakeTimers().setSystemTime(Date.now());
    const cache = new InterpretationCacheService();
    const key = cache.createKey({ dream: "테스트" });
    cache.set(key, "value");

    jest.advanceTimersByTime(11);
    expect(cache.get(key)).toBeNull();
  });
});
