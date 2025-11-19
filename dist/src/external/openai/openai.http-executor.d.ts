import type { ConfigType } from '@nestjs/config';
import { openAIConfig } from './openai.config';
export interface OpenAIHttpResponse {
    ok: boolean;
    status: number;
    statusText: string;
    body: unknown;
}
export declare class OpenAIHttpExecutor {
    private readonly config;
    constructor(config: ConfigType<typeof openAIConfig>);
    post(url: string, headers: Record<string, string>, payload: unknown): Promise<OpenAIHttpResponse>;
    private parseBody;
}
