import { INTERPRETATION_LOCK_PREFIX } from "./interpretation-lock.constants";

export class InterpretationLockKeyFactory {
  public static create(userId: string, idempotencyKey: string) {
    const normalizedKey = idempotencyKey?.trim();
    return `${INTERPRETATION_LOCK_PREFIX}:${userId}:${normalizedKey}`;
  }
}
