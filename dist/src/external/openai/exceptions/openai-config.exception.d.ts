import { InternalServerErrorException } from '@nestjs/common';
export declare class OpenAIConfigException extends InternalServerErrorException {
    constructor(message: string);
}
