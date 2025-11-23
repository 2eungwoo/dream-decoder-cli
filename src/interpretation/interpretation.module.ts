import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InterpretationController } from "./interpretation.controller";
import { InterpretationService } from "./interpretation.service";
import { EmbeddingModule } from "../external/embedding/embedding.module";
import { OpenAIModule } from "../external/openai/openai.module";
import { EmbeddingInputFactory } from "./factories/embedding-input.factory";
import { DreamSymbolRepository } from "./datasources/dream-symbol.repository";
import { InterpretationUserPromptBuilder } from "./prompts/interpretation-user-prompt.builder";
import { InterpretAuthGuard } from "./guards/interpret-auth.guard";
import { User } from "../users/user.entity";
import { AuthModule } from "../auth/auth.module";
import { InterpretationCacheService } from "./cache/interpretation-cache.service";
import { InterpretationSemaphoreService } from "./semaphore/interpretation-semaphore.service";
import { InterpretationSemaphoreInterceptor } from "./semaphore/interpretation-semaphore.interceptor";
import { InterpretationSimilarityEvaluator } from "./rankings/interpretation-similarity.evaluator";
@Module({
  imports: [
    EmbeddingModule,
    OpenAIModule,
    AuthModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [InterpretationController],
  providers: [
    InterpretationService,
    EmbeddingInputFactory,
    DreamSymbolRepository,
    InterpretationUserPromptBuilder,
    InterpretAuthGuard,
    InterpretationCacheService,
    InterpretationSemaphoreService,
    InterpretationSemaphoreInterceptor,
    InterpretationSimilarityEvaluator,
  ],
})
export class InterpretationModule {}
