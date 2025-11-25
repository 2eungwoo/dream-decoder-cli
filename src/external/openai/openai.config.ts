import { registerAs } from '@nestjs/config';

export const openAIConfig = registerAs('openai', () => ({
  apiKey: process.env.OPENAI_API_KEY ?? '',
  apiUrl:
    process.env.OPENAI_API_URL ??
    process.env.OTHER_URL ??
    'https://api.openai.com/v1/chat/completions',
  model: process.env.OPENAI_MODEL ?? 'gpt-5-nano',
  timeoutMs: Number(process.env.OPENAI_TIMEOUT_MS ?? '60000'),
}));
