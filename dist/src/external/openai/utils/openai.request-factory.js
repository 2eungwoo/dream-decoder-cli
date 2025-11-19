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
exports.OpenAIRequestFactory = void 0;
const common_1 = require("@nestjs/common");
const openai_config_1 = require("../openai.config");
const openai_config_exception_1 = require("../exceptions/openai-config.exception");
let OpenAIRequestFactory = class OpenAIRequestFactory {
    config;
    constructor(config) {
        this.config = config;
        this.ensureConfiguration();
    }
    getEndpoint() {
        return this.config.apiUrl;
    }
    createHeaders() {
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`,
        };
    }
    createPayload(message) {
        return this.createPayloadFromMessages([
            {
                role: 'user',
                content: message,
            },
        ]);
    }
    createPayloadFromMessages(messages) {
        return {
            model: this.config.model,
            messages,
        };
    }
    ensureConfiguration() {
        if (!this.config.apiKey) {
            throw new openai_config_exception_1.OpenAIConfigException('<!> OpenAI API Key 설정 확인');
        }
        if (!this.config.apiUrl) {
            throw new openai_config_exception_1.OpenAIConfigException('<!> OpenAI API URL 설정 확인');
        }
        if (!this.config.model) {
            throw new openai_config_exception_1.OpenAIConfigException('<!> OpenAI 모델 설정 확인');
        }
    }
};
exports.OpenAIRequestFactory = OpenAIRequestFactory;
exports.OpenAIRequestFactory = OpenAIRequestFactory = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(openai_config_1.openAIConfig.KEY)),
    __metadata("design:paramtypes", [void 0])
], OpenAIRequestFactory);
//# sourceMappingURL=openai.request-factory.js.map