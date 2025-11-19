import { Module } from '@nestjs/common';
import { InterpretationController } from './interpretation.controller';
import { InterpretationService } from './interpretation.service';
import { EmbeddingModule } from '../external/embedding/embedding.module';
import { OpenAIModule } from '../external/openai/openai.module';
import { EmbeddingInputFactory } from './factories/embedding-input.factory';
import { DreamSymbolRepository } from './datasources/dream-symbol.repository';
import { InterpretationPromptBuilder } from './prompts/interpretation-prompt.builder';

@Module({
  imports: [EmbeddingModule, OpenAIModule],
  controllers: [InterpretationController],
  providers: [
    InterpretationService,
    EmbeddingInputFactory,
    DreamSymbolRepository,
    InterpretationPromptBuilder,
  ],
})
export class InterpretationModule {}
