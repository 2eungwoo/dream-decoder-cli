import type { OpenAIHttpResponse } from '../openai.http-executor';
export declare class OpenAIResponseParser {
    parse(response: OpenAIHttpResponse): string;
    private extractReply;
    private extractErrorMessage;
    private isResponseBody;
    private isErrorBody;
}
