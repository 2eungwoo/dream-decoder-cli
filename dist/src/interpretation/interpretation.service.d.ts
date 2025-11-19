import { EmbeddingClient } from '../external/embedding/embedding.client';
import { OpenAIClient } from '../external/openai/openai.client';
import { InterpretDreamRequestDto } from './dto/interpret-dream-request.dto';
import { EmbeddingInputFactory } from './factories/embedding-input.factory';
import { DreamSymbolRepository } from './datasources/dream-symbol.repository';
import { InterpretationPromptBuilder } from './prompts/interpretation-prompt.builder';
export declare class InterpretationService {
    private readonly embeddingInputFactory;
    private readonly embeddingClient;
    private readonly symbolRepository;
    private readonly promptBuilder;
    private readonly openAIClient;
    constructor(embeddingInputFactory: EmbeddingInputFactory, embeddingClient: EmbeddingClient, symbolRepository: DreamSymbolRepository, promptBuilder: InterpretationPromptBuilder, openAIClient: OpenAIClient);
    interpret(request: InterpretDreamRequestDto): Promise<import("../shared/dto/api-response.dto").ApiSuccessResponse<{
        interpretation: string;
        references: import("./types/related-symbol.type").RelatedSymbol[];
    }>>;
}
