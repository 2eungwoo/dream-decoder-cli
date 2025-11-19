"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretationService = void 0;
const common_1 = require("@nestjs/common");
const embedding_client_1 = require("../external/embedding/embedding.client");
const openai_client_1 = require("../external/openai/openai.client");
const api_response_dto_1 = require("../shared/dto/api-response.dto");
const embedding_input_factory_1 = require("./factories/embedding-input.factory");
const dream_symbol_repository_1 = require("./datasources/dream-symbol.repository");
const interpretation_prompt_builder_1 = require("./prompts/interpretation-prompt.builder");
const invalid_dream_exception_1 = require("./exceptions/invalid-dream.exception");
const common_2 = require("@nestjs/common");
let InterpretationService = class InterpretationService {
    embeddingInputFactory;
    embeddingClient;
    symbolRepository;
    promptBuilder;
    openAIClient;
    constructor(embeddingInputFactory, embeddingClient, symbolRepository, promptBuilder, openAIClient) {
        this.embeddingInputFactory = embeddingInputFactory;
        this.embeddingClient = embeddingClient;
        this.symbolRepository = symbolRepository;
        this.promptBuilder = promptBuilder;
        this.openAIClient = openAIClient;
    }
    async interpret(request) {
        if (!request?.dream?.trim()) {
            throw new invalid_dream_exception_1.InvalidDreamException();
        }
        const embeddingInput = this.embeddingInputFactory.createFromRequest(request);
        const embeddings = await this.embeddingClient.embed([embeddingInput]);
        if (!embeddings.length) {
            throw new common_2.InternalServerErrorException('<!> 임베딩 생성에 실패했습니다.');
        }
        const relatedSymbols = await this.symbolRepository.findNearestByEmbedding(embeddings[0], 5);
        const prompt = this.promptBuilder.buildPrompt(request, relatedSymbols);
        const interpretation = await this.openAIClient.generateFromMessages([
            {
                role: 'system',
                content: 'You are Dream Decoder, a compassionate yet insightful analyst who explains dreams clearly and offers practical guidance.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ]);
        return api_response_dto_1.ApiResponseFactory.success({
            interpretation,
            references: relatedSymbols,
        }, 'Dream interpretation generated successfully.');
    }
};
exports.InterpretationService = InterpretationService;
exports.InterpretationService = InterpretationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [embedding_input_factory_1.EmbeddingInputFactory,
        embedding_client_1.EmbeddingClient,
        dream_symbol_repository_1.DreamSymbolRepository,
        interpretation_prompt_builder_1.InterpretationPromptBuilder,
        openai_client_1.OpenAIClient])
], InterpretationService);
//# sourceMappingURL=interpretation.service.js.map