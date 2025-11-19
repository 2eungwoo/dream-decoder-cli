import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { openAIConfig } from '../openai.config';
import { OpenAIConfigException } from '../exceptions/openai-config.exception';
import { OpenAIChatPayload, OpenAIMessage } from '../types/openai.types';

@Injectable()
export class OpenAIRequestFactory {
  constructor(
    @Inject(openAIConfig.KEY)
    private readonly config: ConfigType<typeof openAIConfig>,
  ) {
    this.ensureConfiguration();
  }

  public getEndpoint() {
    return this.config.apiUrl;
  }

  public createHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.config.apiKey}`,
    };
  }

  public createPayload(message: string) {
    return this.createPayloadFromMessages([
      {
        role: 'user',
        content: message,
      },
    ]);
  }

  public createPayloadFromMessages(
    messages: OpenAIMessage[],
  ): OpenAIChatPayload {
    return {
      model: this.config.model,
      messages,
    };
  }

  private ensureConfiguration() {
    if (!this.config.apiKey) {
      throw new OpenAIConfigException('<!> OpenAI API Key 설정 확인');
    }

    if (!this.config.apiUrl) {
      throw new OpenAIConfigException('<!> OpenAI API URL 설정 확인');
    }

    if (!this.config.model) {
      throw new OpenAIConfigException('<!> OpenAI 모델 설정 확인');
    }
  }
}
