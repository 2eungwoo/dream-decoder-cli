"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidDreamException = void 0;
const common_1 = require("@nestjs/common");
class InvalidDreamException extends common_1.BadRequestException {
    constructor() {
        super('<!> 꿈 내용을 입력해주세요.');
    }
}
exports.InvalidDreamException = InvalidDreamException;
//# sourceMappingURL=invalid-dream.exception.js.map