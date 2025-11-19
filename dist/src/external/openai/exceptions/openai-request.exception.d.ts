import { InternalServerErrorException } from '@nestjs/common';
export declare class OpenAIRequestException extends InternalServerErrorException {
    constructor(message: string, details?: unknown);
}
