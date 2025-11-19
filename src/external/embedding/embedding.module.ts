import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmbeddingClient } from './embedding.client';
import { embeddingConfig } from './embedding.config';

@Module({
  imports: [ConfigModule.forFeature(embeddingConfig)],
  providers: [EmbeddingClient],
  exports: [EmbeddingClient],
})
export class EmbeddingModule {}
