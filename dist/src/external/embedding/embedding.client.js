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
exports.EmbeddingClient = void 0;
const common_1 = require("@nestjs/common");
const embedding_config_1 = require("./embedding.config");
const embedding_api_exception_1 = require("./exceptions/embedding-api.exception");
let EmbeddingClient = class EmbeddingClient {
    config;
    constructor(config) {
        this.config = config;
    }
    async embed(texts) {
        if (!texts?.length) {
            return [];
        }
        const payload = { texts };
        return this.execute(payload);
    }
    async execute(payload) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
        try {
            const response = await fetch(this.config.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal,
            });
            if (!response.ok) {
                const errorBody = await response.text().catch(() => '');
                throw new embedding_api_exception_1.EmbeddingApiException('<!> Embedding API 호출부 에러 발생', {
                    status: response.status,
                    body: errorBody,
                });
            }
            const data = (await response.json());
            return data.embeddings;
        }
        catch (error) {
            if (error instanceof embedding_api_exception_1.EmbeddingApiException) {
                throw error;
            }
            throw new embedding_api_exception_1.EmbeddingApiException('<!> Embedding API 응답부 에러 발생', error);
        }
        finally {
            clearTimeout(timeout);
        }
    }
};
exports.EmbeddingClient = EmbeddingClient;
exports.EmbeddingClient = EmbeddingClient = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(embedding_config_1.embeddingConfig.KEY)),
    __metadata("design:paramtypes", [void 0])
], EmbeddingClient);
//# sourceMappingURL=embedding.client.js.map