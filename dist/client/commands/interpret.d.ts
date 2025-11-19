import { SessionStore } from '../sessions/session-store';
type QuestionFn = (prompt: string) => Promise<string>;
export declare function handleInterpret(ask: QuestionFn, sessions: SessionStore): Promise<void>;
export {};
