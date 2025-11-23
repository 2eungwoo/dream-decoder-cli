import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request } from "express";
import { AuthValidator } from "../../auth/exceptions/auth.validator";
import { PasswordService } from "../../auth/password.service";
import { User } from "../../users/user.entity";

@Injectable()
export class InterpretAuthGuard implements CanActivate {
  constructor(
    private readonly authValidator: AuthValidator,
    private readonly passwordService: PasswordService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  public async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const usernameHeader = request.header("x-username");
    const passwordHeader = request.header("x-password");

    const { username, password } = this.authValidator.ensureCredentials(
      usernameHeader,
      passwordHeader
    );

    const user = this.authValidator.ensureUserExists(
      await this.usersRepository.findOne({
        where: { username },
      })
    );

    this.authValidator.ensurePasswordValid(
      this.passwordService.verify(password, user.passwordHash)
    );

    this.authValidator.ensureUserLoggedIn(user.isLoggedIn);
    request.user = { id: user.id, username: user.username }; // d.ts 에서 타입 알려줬으니 여기서 request.user 추가
    return true;
  }
}
