"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIConfigException = void 0;
const common_1 = require("@nestjs/common");
class OpenAIConfigException extends common_1.InternalServerErrorException {
    constructor(message) {
        super(`<!> OpenAI 설정 오류: ${message}`);
    }
}
exports.OpenAIConfigException = OpenAIConfigException;
//# sourceMappingURL=openai-config.exception.js.map