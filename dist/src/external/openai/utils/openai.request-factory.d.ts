import type { ConfigType } from '@nestjs/config';
import { openAIConfig } from '../openai.config';
import { OpenAIChatPayload, OpenAIMessage } from '../types/openai.types';
export declare class OpenAIRequestFactory {
    private readonly config;
    constructor(config: ConfigType<typeof openAIConfig>);
    getEndpoint(): string;
    createHeaders(): {
        'Content-Type': string;
        Authorization: string;
    };
    createPayload(message: string): OpenAIChatPayload;
    createPayloadFromMessages(messages: OpenAIMessage[]): OpenAIChatPayload;
    private ensureConfiguration;
}
