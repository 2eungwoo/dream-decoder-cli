"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIRequestException = void 0;
const common_1 = require("@nestjs/common");
class OpenAIRequestException extends common_1.InternalServerErrorException {
    constructor(message, details) {
        super({
            message: `<!> OpenAI 요청 실패: ${message}`,
            details,
        });
    }
}
exports.OpenAIRequestException = OpenAIRequestException;
//# sourceMappingURL=openai-request.exception.js.map