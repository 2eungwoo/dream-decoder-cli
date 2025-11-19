export interface OpenAIMessage {
  // system : 모델에게 역할 지침 줄 용도
  // user : 사용자 입력 전달
  // assistannt: 이전 응답으로 다음 응답 구성 시 사용할 수 있음
  role: 'system' | 'user'; // | 'assistant';
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
