import { ChatService } from './chat.service';
import type { ChatRequestDto } from './dto/chat.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    chat(payload: ChatRequestDto): Promise<{
        reply: string;
    }>;
}
