import { Repository } from 'typeorm';
import { AuthValidator } from '../auth/auth.validator';
import { PasswordService } from '../auth/password.service';
import { User } from '../users/user.entity';
import { OpenAIClient } from '../external/openai/openai.client';
import { ChatValidator } from './chat.validator';
export declare class ChatService {
    private readonly authValidator;
    private readonly chatValidator;
    private readonly passwordService;
    private readonly openAIClient;
    private readonly usersRepository;
    constructor(authValidator: AuthValidator, chatValidator: ChatValidator, passwordService: PasswordService, openAIClient: OpenAIClient, usersRepository: Repository<User>);
    sendMessage(username: string, password: string, message: string): Promise<{
        reply: string;
    }>;
}
