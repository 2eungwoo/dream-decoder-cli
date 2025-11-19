"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIHttpExecutor = void 0;
const common_1 = require("@nestjs/common");
const openai_config_1 = require("./openai.config");
const openai_request_exception_1 = require("./exceptions/openai-request.exception");
let OpenAIHttpExecutor = class OpenAIHttpExecutor {
    config;
    constructor(config) {
        this.config = config;
    }
    async post(url, headers, payload) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
                signal: controller.signal,
            });
            const body = await this.parseBody(response);
            return {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                body,
            };
        }
        catch (error) {
            throw new openai_request_exception_1.OpenAIRequestException('네트워크 요청 중 오류 발생', error);
        }
        finally {
            clearTimeout(timeout);
        }
    }
    async parseBody(response) {
        const text = await response.text();
        if (!text) {
            return {};
        }
        try {
            return JSON.parse(text);
        }
        catch {
            return {};
        }
    }
};
exports.OpenAIHttpExecutor = OpenAIHttpExecutor;
exports.OpenAIHttpExecutor = OpenAIHttpExecutor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(openai_config_1.openAIConfig.KEY)),
    __metadata("design:paramtypes", [void 0])
], OpenAIHttpExecutor);
//# sourceMappingURL=openai.http-executor.js.map