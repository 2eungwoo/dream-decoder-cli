import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { EmbeddingClient } from "../external/embedding/embedding.client";
import { OpenAIClient } from "../external/openai/openai.client";
import { InterpretDreamRequestDto } from "./dto/interpret-dream-request.dto";
import { ApiResponseFactory } from "../shared/dto/api-response.dto";
import { EmbeddingInputFactory } from "./factories/embedding-input.factory";
import { DreamSymbolRepository } from "./datasources/dream-symbol.repository";
import { InterpretationUserPromptBuilder } from "./prompts/interpretation-user-prompt.builder";
import { InvalidDreamException } from "./exceptions/invalid-dream.exception";
import { InterpretationCacheService } from "./cache/interpretation-cache.service";
import { DreamSymbolDto } from "./types/dream-symbol.dto";
import { InterpretationSimilarityEvaluator } from "./rankings/interpretation-similarity.evaluator";
import { INTERPRETATION_SYSTEM_PROMPT } from "./prompts/interpretation-system.prompt";

@Injectable()
export class InterpretationService {
  constructor(
    private readonly embeddingInputFactory: EmbeddingInputFactory,
    private readonly embeddingClient: EmbeddingClient,
    private readonly symbolRepository: DreamSymbolRepository,
    private readonly promptBuilder: InterpretationUserPromptBuilder,
    private readonly openAIClient: OpenAIClient,
    private readonly cacheService: InterpretationCacheService,
    private readonly similarityEvaluator: InterpretationSimilarityEvaluator
  ) {}

  TOP_N = 5;
  public async interpret(request: InterpretDreamRequestDto) {
    if (!request?.dream?.trim()) {
      throw new InvalidDreamException();
    }

    const cacheKey = this.cacheService.createKey(request);
    const cached = this.cacheService.get(cacheKey);
    if (cached) {
      return ApiResponseFactory.success(
        { interpretation: cached },
        "해몽 결과가 캐시에서 불러와졌습니다."
      );
    }

    const embeddingInput =
      this.embeddingInputFactory.createFromRequest(request);
    const embeddings = await this.embeddingClient.embed([embeddingInput]);
    if (!embeddings.length) {
      throw new InternalServerErrorException("<!> 임베딩 생성에 실패했습니다.");
    }

    const relatedSymbols: DreamSymbolDto[] =
      await this.symbolRepository.findNearestByEmbedding(
        embeddings[0],
        this.TOP_N
      );
    const ranked = this.similarityEvaluator.rank(request, relatedSymbols);

    const prompt = this.promptBuilder.buildUserPrompt(request, ranked);
    const interpretation = await this.openAIClient.generateFromMessages([
      {
        role: "system",
        content: INTERPRETATION_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: prompt, // INTERPRETATION_USER_PROMPT
      },
    ]);

    const response = ApiResponseFactory.success(
      { interpretation },
      "해몽이 완료되었습니다! 아래 내용을 확인해주세요"
    );
    this.cacheService.set(cacheKey, interpretation);
    return response;
  }
}
