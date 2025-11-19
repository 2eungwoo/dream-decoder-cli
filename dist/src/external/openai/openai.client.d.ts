import { OpenAIRequestFactory } from './utils/openai.request-factory';
import { OpenAIHttpExecutor } from './openai.http-executor';
import { OpenAIResponseParser } from './utils/openai.response-parser';
import { OpenAIMessage } from './types/openai.types';
export declare class OpenAIClient {
    private readonly requestFactory;
    private readonly httpExecutor;
    private readonly responseParser;
    constructor(requestFactory: OpenAIRequestFactory, httpExecutor: OpenAIHttpExecutor, responseParser: OpenAIResponseParser);
    generateReply(message: string): Promise<string>;
    generateFromMessages(messages: OpenAIMessage[]): Promise<string>;
}
