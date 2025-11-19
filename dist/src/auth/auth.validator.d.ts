export declare class AuthValidator {
    ensureCredentials(username?: string, password?: string): {
        username: string;
        password: string;
    };
    ensureUsernameAvailable(isTaken: boolean, username: string): void;
    ensureUserExists<T>(user: T | undefined | null): T;
    ensurePasswordValid(isValid: boolean): void;
    ensureUserLoggedIn(isLoggedIn: boolean): void;
}
