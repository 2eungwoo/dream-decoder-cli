import { InternalServerErrorException } from '@nestjs/common';
export declare class EmbeddingApiException extends InternalServerErrorException {
    constructor(message: string, details?: unknown);
}
