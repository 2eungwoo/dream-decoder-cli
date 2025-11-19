import type { ConfigType } from '@nestjs/config';
import { embeddingConfig } from './embedding.config';
export declare class EmbeddingClient {
    private readonly config;
    constructor(config: ConfigType<typeof embeddingConfig>);
    embed(texts: string[]): Promise<number[][]>;
    private execute;
}
