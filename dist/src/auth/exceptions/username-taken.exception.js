"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsernameTakenException = void 0;
const common_1 = require("@nestjs/common");
class UsernameTakenException extends common_1.BadRequestException {
    constructor(username) {
        super(`<!> ${username}은(는) 이미 사용 중입니다.`);
    }
}
exports.UsernameTakenException = UsernameTakenException;
//# sourceMappingURL=username-taken.exception.js.map