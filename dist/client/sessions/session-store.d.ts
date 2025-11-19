export interface SessionData {
    username: string;
    password: string;
}
export declare class SessionStore {
    private session;
    set(session: SessionData): void;
    clear(): void;
    get(): SessionData | null;
    ensureSession(): SessionData;
}
