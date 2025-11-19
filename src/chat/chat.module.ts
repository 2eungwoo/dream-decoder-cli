import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/user.entity';
import { OpenAIModule } from '../external/openai/openai.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatValidator } from './chat.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User]), OpenAIModule, AuthModule],
  controllers: [ChatController],
  providers: [ChatService, ChatValidator],
})
export class ChatModule {}
