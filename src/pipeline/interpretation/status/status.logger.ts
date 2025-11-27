import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class InterpretationStatusLogger {
  private readonly logger = new Logger("InterpretationStatus");

  public initialized(requestId: string, username: string, payloadLength: number) {
    this.logger.log(
      this.format(
        requestId,
        `initialized for user=${username} (payload length=${payloadLength})`
      )
    );
  }

  public pending(requestId: string, reason?: string | null) {
    this.logger.debug(
      this.format(requestId, `-> pending (reason=${reason || "none"})`)
    );
  }

  public running(requestId: string) {
    this.logger.debug(this.format(requestId, "-> running"));
  }

  public completed(requestId: string, fromCache: boolean) {
    this.logger.log(
      this.format(requestId, `-> completed (fromCache=${fromCache})`)
    );
  }

  public failed(requestId: string, reason: string) {
    this.logger.warn(this.format(requestId, `-> failed (reason=${reason})`));
  }

  public retry(requestId: string, retryCount: number) {
    this.logger.warn(this.format(requestId, `retry-count -> ${retryCount}`));
  }

  private format(requestId: string, message: string) {
    return `[Status] ${requestId} ${message}`;
  }
}
