"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotLoggedInException = void 0;
const common_1 = require("@nestjs/common");
class UserNotLoggedInException extends common_1.UnauthorizedException {
    constructor() {
        super('<!> 로그인도 안하고 로그아웃을??');
    }
}
exports.UserNotLoggedInException = UserNotLoggedInException;
//# sourceMappingURL=user-not-logged-in.exception.js.map