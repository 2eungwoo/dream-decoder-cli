export interface OpenAIMessage {
    role: 'system' | 'user';
    content: string;
}
export interface OpenAIChatPayload {
    model: string;
    messages: OpenAIMessage[];
}
export interface OpenAIChoice {
    message?: {
        content?: string;
    };
}
export interface OpenAIResponseBody {
    choices: OpenAIChoice[];
}
export interface OpenAIErrorBody {
    error?: {
        message?: string;
    };
}
