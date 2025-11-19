"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIResponseParser = void 0;
const common_1 = require("@nestjs/common");
const openai_request_exception_1 = require("../exceptions/openai-request.exception");
let OpenAIResponseParser = class OpenAIResponseParser {
    parse(response) {
        if (!response.ok) {
            throw new openai_request_exception_1.OpenAIRequestException(this.extractErrorMessage(response.body));
        }
        return this.extractReply(response.body);
    }
    extractReply(body) {
        if (this.isResponseBody(body) && body.choices.length > 0) {
            const content = body.choices[0]?.message?.content;
            if (typeof content === 'string') {
                return content;
            }
        }
        return '<!> AI 응답을 생성할 수 없습니다.';
    }
    extractErrorMessage(body) {
        if (this.isErrorBody(body) && body.error?.message) {
            return body.error.message;
        }
        return '<!> AI 통신에 실패했습니다.';
    }
    isResponseBody(body) {
        return (typeof body === 'object' &&
            body !== null &&
            Array.isArray(body.choices));
    }
    isErrorBody(body) {
        return typeof body === 'object' && body !== null && 'error' in body;
    }
};
exports.OpenAIResponseParser = OpenAIResponseParser;
exports.OpenAIResponseParser = OpenAIResponseParser = __decorate([
    (0, common_1.Injectable)()
], OpenAIResponseParser);
//# sourceMappingURL=openai.response-parser.js.map