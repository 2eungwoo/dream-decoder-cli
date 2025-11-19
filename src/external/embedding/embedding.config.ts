import { registerAs } from '@nestjs/config';

export const embeddingConfig = registerAs('embedding', () => ({
  apiUrl: process.env.EMBEDDING_API_URL ?? 'http://localhost:8001/embed',
  timeoutMs: Number(process.env.EMBEDDING_TIMEOUT_MS ?? '10000'),
}));
