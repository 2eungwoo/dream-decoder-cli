import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { embeddingConfig } from './embedding.config';
import { EmbeddingPayload, EmbeddingResponse } from './types/embedding.types';
import { EmbeddingApiException } from './exceptions/embedding-api.exception';

@Injectable()
export class EmbeddingClient {
  constructor(
    @Inject(embeddingConfig.KEY)
    private readonly config: ConfigType<typeof embeddingConfig>,
  ) {}

  public async embed(texts: string[]) {
    if (!texts?.length) {
      return [];
    }

    const payload: EmbeddingPayload = { texts };
    return this.execute(payload);
  }

  // fastapi embedding-server 연결해서 사용자 요청 임베딩
  private async execute(payload: EmbeddingPayload) {
    const controller = new AbortController(); // fetch요청 취소시킬 수 있음 -> .abort()
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
        throw new EmbeddingApiException('<!> Embedding API 호출부 에러 발생', {
          status: response.status,
          body: errorBody,
        });
      }

      const data = (await response.json()) as EmbeddingResponse;
      return data.embeddings;
    } catch (error) {
      if (error instanceof EmbeddingApiException) {
        throw error;
      }
      throw new EmbeddingApiException(
        '<!> Embedding API 응답부 에러 발생',
        error,
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}
