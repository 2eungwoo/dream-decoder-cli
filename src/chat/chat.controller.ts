import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  public chat(@Body() payload: ChatRequestDto) {
    return this.chatService.sendMessage(
      payload.username,
      payload.password,
      payload.message,
    );
  }
}
