import { HttpException, HttpStatus } from "@nestjs/common";

export class InterpretationThrottleException extends HttpException {
  constructor() {
    super(
      "<!> 해석 요청이 몰리고 있어 잠시 후 다시 시도해주세요.",
      HttpStatus.TOO_MANY_REQUESTS // 429
    );
  }
}
