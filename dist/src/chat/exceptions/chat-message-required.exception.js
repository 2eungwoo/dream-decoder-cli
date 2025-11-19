"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageRequiredException = void 0;
const common_1 = require("@nestjs/common");
class ChatMessageRequiredException extends common_1.BadRequestException {
    constructor() {
        super('<!> 대화 내용을 입력해주세요.');
    }
}
exports.ChatMessageRequiredException = ChatMessageRequiredException;
//# sourceMappingURL=chat-message-required.exception.js.map