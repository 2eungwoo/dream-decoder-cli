"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingApiException = void 0;
const common_1 = require("@nestjs/common");
class EmbeddingApiException extends common_1.InternalServerErrorException {
    constructor(message, details) {
        super({
            message: `<!> 임베딩 API 오류: ${message}`,
            details,
        });
    }
}
exports.EmbeddingApiException = EmbeddingApiException;
//# sourceMappingURL=embedding-api.exception.js.map