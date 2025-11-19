import { BadRequestException } from '@nestjs/common';
export declare class UsernameTakenException extends BadRequestException {
    constructor(username: string);
}
