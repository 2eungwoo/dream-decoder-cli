import { BaseTimeEntity } from '../shared/entities/base-time.entity';
export declare class User extends BaseTimeEntity {
    username: string;
    passwordHash: string;
    isLoggedIn: boolean;
}
