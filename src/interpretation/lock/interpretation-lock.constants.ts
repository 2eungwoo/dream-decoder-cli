export const INTERPRETATION_LOCK_PREFIX =
  process.env.INTERPRET_LOCK_PREFIX ?? "interpretation:lock";

export const INTERPRETATION_LOCK_TTL_SECONDS = Number(
  process.env.INTERPRET_LOCK_TTL ?? "30"
);

export const INTERPRETATION_IDEMPOTENCY_HEADER =
  "x-idempotency-key";
