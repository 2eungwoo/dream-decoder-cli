import { ConflictException } from "@nestjs/common";

export class InterpretationDuplicateRequestException extends ConflictException {
  constructor() {
    super(
      "<!> 동일한 꿈 해석 요청을 처리 중입니다. 잠시 후 다시 시도해주세요."
    );
  }
}
