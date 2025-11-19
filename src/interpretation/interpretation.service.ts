import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EmbeddingClient } from '../external/embedding/embedding.client';
import { OpenAIClient } from '../external/openai/openai.client';
import { InterpretDreamRequestDto } from './dto/interpret-dream-request.dto';
import { ApiResponseFactory } from '../shared/dto/api-response.dto';
import { EmbeddingInputFactory } from './factories/embedding-input.factory';
import { DreamSymbolRepository } from './datasources/dream-symbol.repository';
import { InterpretationPromptBuilder } from './prompts/interpretation-prompt.builder';
import { InvalidDreamException } from './exceptions/invalid-dream.exception';

@Injectable()
export class InterpretationService {
  constructor(
    private readonly embeddingInputFactory: EmbeddingInputFactory,
    private readonly embeddingClient: EmbeddingClient,
    private readonly symbolRepository: DreamSymbolRepository,
    private readonly promptBuilder: InterpretationPromptBuilder,
    private readonly openAIClient: OpenAIClient,
  ) {}

  public async interpret(request: InterpretDreamRequestDto) {
    if (!request?.dream?.trim()) {
      throw new InvalidDreamException();
    }

    const embeddingInput = this.embeddingInputFactory.createFromRequest(request);
    const embeddings = await this.embeddingClient.embed([embeddingInput]);
    if (!embeddings.length) {
      throw new InternalServerErrorException(
        '<!> 임베딩 생성에 실패했습니다.',
      );
    }

    const relatedSymbols = await this.symbolRepository.findNearestByEmbedding(
      embeddings[0],
      5,
    );

    const prompt = this.promptBuilder.buildPrompt(request, relatedSymbols);
    const interpretation = await this.openAIClient.generateFromMessages([
      {
        role: 'system',
        content:
          'You are Dream Decoder, a compassionate yet insightful analyst who explains dreams clearly and offers practical guidance. Limit your response to 500 characters (including spaces), avoid repetition, and focus on two or three key insights and brief advice.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    return ApiResponseFactory.success(
      {
        interpretation,
        references: relatedSymbols,
      },
      'Dream interpretation generated successfully.',
    );
  }
}
