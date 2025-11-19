"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentialsException = void 0;
const common_1 = require("@nestjs/common");
class InvalidCredentialsException extends common_1.UnauthorizedException {
    constructor() {
        super('<!> username/password를 확인해주세요.');
    }
}
exports.InvalidCredentialsException = InvalidCredentialsException;
//# sourceMappingURL=invalid-credentials.exception.js.map