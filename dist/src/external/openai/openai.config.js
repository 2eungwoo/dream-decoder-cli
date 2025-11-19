"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openAIConfig = void 0;
const config_1 = require("@nestjs/config");
exports.openAIConfig = (0, config_1.registerAs)('openai', () => ({
    apiKey: process.env.OPENAI_API_KEY ?? '',
    apiUrl: process.env.OPENAI_API_URL ??
        process.env.OTHER_URL ??
        'https://api.openai.com/v1/chat/completions',
    model: process.env.OPENAI_MODEL ?? 'gpt-5-nano',
    timeoutMs: Number(process.env.OPENAI_TIMEOUT_MS ?? '10000'),
}));
//# sourceMappingURL=openai.config.js.map