import { Injectable } from '@nestjs/common';
import { OpenAIRequestFactory } from './utils/openai.request-factory';
import { OpenAIHttpExecutor } from './openai.http-executor';
import { OpenAIResponseParser } from './utils/openai.response-parser';
import { OpenAIMessage } from './types/openai.types';

@Injectable()
export class OpenAIClient {
  constructor(
    private readonly requestFactory: OpenAIRequestFactory,
    private readonly httpExecutor: OpenAIHttpExecutor,
    private readonly responseParser: OpenAIResponseParser,
  ) {}

  public async generateReply(message: string) {
    return this.generateFromMessages([
      {
        role: 'user',
        content: message,
      },
    ]);
  }

  public async generateFromMessages(messages: OpenAIMessage[]) {
    const payload = this.requestFactory.createPayloadFromMessages(messages);
    const response = await this.httpExecutor.post(
      this.requestFactory.getEndpoint(),
      this.requestFactory.createHeaders(),
      payload,
    );

    return this.responseParser.parse(response);
  }
}
