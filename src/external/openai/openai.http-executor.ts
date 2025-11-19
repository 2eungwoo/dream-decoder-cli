import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { openAIConfig } from './openai.config';
import { OpenAIRequestException } from './exceptions/openai-request.exception';

export interface OpenAIHttpResponse {
  ok: boolean;
  status: number;
  statusText: string;
  body: unknown;
}

@Injectable()
export class OpenAIHttpExecutor {
  constructor(
    @Inject(openAIConfig.KEY)
    private readonly config: ConfigType<typeof openAIConfig>,
  ) {}

  public async post(
    url: string,
    headers: Record<string, string>,
    payload: unknown,
  ): Promise<OpenAIHttpResponse> {
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
    } catch (error) {
      throw new OpenAIRequestException('네트워크 요청 중 오류 발생', error);
    } finally {
      clearTimeout(timeout);
    }
  }

  private async parseBody(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch {
      return {};
    }
  }
}
