import { NotFoundException } from "@nestjs/common";

export class InterpretationRecordNotFoundException extends NotFoundException {
  constructor() {
    super("<!> 저장된 해몽을 찾을 수 없습니다.");
  }
}
