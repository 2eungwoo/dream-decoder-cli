export enum RecoveryFailureCode {
  REDIS_UNAVAILABLE = "redis_unavailable",
  STREAM_WRITE_FAILED = "stream_write_failed",
  UNKNOWN = "unknown",
}

export interface BacklogRecoveryResult {
  attempted: number;
  succeeded: number;
  failed: number;
}
