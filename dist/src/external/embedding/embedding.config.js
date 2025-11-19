"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embeddingConfig = void 0;
const config_1 = require("@nestjs/config");
exports.embeddingConfig = (0, config_1.registerAs)('embedding', () => ({
    apiUrl: process.env.EMBEDDING_API_URL ?? 'http://localhost:8001/embed',
    timeoutMs: Number(process.env.EMBEDDING_TIMEOUT_MS ?? '10000'),
}));
//# sourceMappingURL=embedding.config.js.map