import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAIClient } from './openai.client';
import { openAIConfig } from './openai.config';
import { OpenAIHttpExecutor } from './openai.http-executor';
import { OpenAIRequestFactory } from './utils/openai.request-factory';
import { OpenAIResponseParser } from './utils/openai.response-parser';

@Module({
  imports: [ConfigModule.forFeature(openAIConfig)],
  providers: [
    OpenAIClient,
    OpenAIRequestFactory,
    OpenAIHttpExecutor,
    OpenAIResponseParser,
  ],
  exports: [OpenAIClient],
})
export class OpenAIModule {}
