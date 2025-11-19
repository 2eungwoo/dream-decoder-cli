import { Injectable } from '@nestjs/common';
import { ChatMessageRequiredException } from './exceptions/chat-message-required.exception';

@Injectable()
export class ChatValidator {
  public ensureMessage(message?: string) {
    if (!message?.trim()) {
      throw new ChatMessageRequiredException();
    }
  }
}
