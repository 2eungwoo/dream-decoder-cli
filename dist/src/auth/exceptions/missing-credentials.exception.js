"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingCredentialsException = void 0;
const common_1 = require("@nestjs/common");
class MissingCredentialsException extends common_1.BadRequestException {
    constructor() {
        super('<!> username/password는 필수입니다.');
    }
}
exports.MissingCredentialsException = MissingCredentialsException;
//# sourceMappingURL=missing-credentials.exception.js.map