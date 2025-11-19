import { Injectable } from '@nestjs/common';
import type { OpenAIHttpResponse } from '../openai.http-executor';
import { OpenAIRequestException } from '../exceptions/openai-request.exception';
import { OpenAIErrorBody, OpenAIResponseBody } from '../types/openai.types';

@Injectable()
export class OpenAIResponseParser {
  public parse(response: OpenAIHttpResponse): string {
    if (!response.ok) {
      throw new OpenAIRequestException(this.extractErrorMessage(response.body));
    }

    return this.extractReply(response.body);
  }

  private extractReply(body: unknown): string {
    if (this.isResponseBody(body) && body.choices.length > 0) {
      const content = body.choices[0]?.message?.content;
      if (typeof content === 'string') {
        return content;
      }
    }

    return '<!> AI 응답을 생성할 수 없습니다.';
  }

  private extractErrorMessage(body: unknown) {
    if (this.isErrorBody(body) && body.error?.message) {
      return body.error.message;
    }

    return '<!> AI 통신에 실패했습니다.';
  }

  private isResponseBody(body: unknown): body is OpenAIResponseBody {
    return (
      typeof body === 'object' &&
      body !== null &&
      Array.isArray((body as { choices?: unknown }).choices)
    );
  }

  private isErrorBody(body: unknown): body is OpenAIErrorBody {
    return typeof body === 'object' && body !== null && 'error' in body;
  }
}
