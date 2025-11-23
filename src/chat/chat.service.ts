import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthValidator } from "../auth/exceptions/auth.validator";
import { PasswordService } from "../auth/password.service";
import { User } from "../users/user.entity";
import { OpenAIClient } from "../external/openai/openai.client";
import { ChatValidator } from "./chat.validator";

@Injectable()
export class ChatService {
  constructor(
    private readonly authValidator: AuthValidator,
    private readonly chatValidator: ChatValidator,
    private readonly passwordService: PasswordService,
    private readonly openAIClient: OpenAIClient,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  public async sendMessage(
    username: string,
    password: string,
    message: string
  ) {
    const { username: normalizedUsername, password: safePassword } =
      this.authValidator.ensureCredentials(username, password);
    const trimmedMessage = message.trim();
    this.chatValidator.ensureMessage(trimmedMessage);

    const user = this.authValidator.ensureUserExists(
      await this.usersRepository.findOne({
        where: { username: normalizedUsername },
      })
    );

    this.authValidator.ensurePasswordValid(
      this.passwordService.verify(safePassword, user.passwordHash)
    );
    this.authValidator.ensureUserLoggedIn(user.isLoggedIn);

    const reply = await this.openAIClient.generateReply(trimmedMessage);
    return { reply };
  }
}
