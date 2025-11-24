export const INTERPRETATION_STREAM_KEY = "dream:requests";
export const INTERPRETATION_DLQ_KEY = "dream:requests:dlq";
export const INTERPRETATION_STATUS_PREFIX = "dream:request-status";
export const INTERPRETATION_STATUS_TTL_SECONDS = 60 * 60 * 12;

export function interpretationStatusKey(requestId: string) {
  return `${INTERPRETATION_STATUS_PREFIX}:${requestId}`;
}
