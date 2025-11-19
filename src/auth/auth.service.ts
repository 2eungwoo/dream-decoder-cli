import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { AuthValidator } from './auth.validator';
import { PasswordService } from './password.service';
import { ApiResponseFactory } from '../shared/dto/api-response.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LogoutRequestDto } from './dto/logout-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly validator: AuthValidator,
    private readonly passwordService: PasswordService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async register(request: RegisterRequestDto) {
    const { username: normalizedUsername, password: safePassword } =
      this.validator.ensureCredentials(request.username, request.password);

    const existingUser = await this.usersRepository.findOne({
      where: { username: normalizedUsername },
    });
    this.validator.ensureUsernameAvailable(
      Boolean(existingUser),
      normalizedUsername,
    );

    const user = this.usersRepository.create({
      username: normalizedUsername,
      passwordHash: this.passwordService.hash(safePassword),
      isLoggedIn: false,
    });
    await this.usersRepository.save(user);

    return ApiResponseFactory.success(
      undefined,
      `${request.username}님 환영합니다. 회원가입 성공했습니다.`,
    );
  }

  public async login(request: LoginRequestDto) {
    const { username: normalizedUsername, password: safePassword } =
      this.validator.ensureCredentials(request.username, request.password);

    const user = this.validator.ensureUserExists(
      await this.usersRepository.findOne({
        where: { username: normalizedUsername },
      }),
    );

    this.validator.ensurePasswordValid(
      this.passwordService.verify(safePassword, user.passwordHash),
    );

    user.isLoggedIn = true;
    await this.usersRepository.save(user);

    return ApiResponseFactory.success(
      undefined,
      `안녕하세요! ${request.username}님`,
    );
  }

  public async logout(request: LogoutRequestDto) {
    const { username: normalizedUsername, password: safePassword } =
      this.validator.ensureCredentials(request.username, request.password);

    const user = this.validator.ensureUserExists(
      await this.usersRepository.findOne({
        where: { username: normalizedUsername },
      }),
    );

    this.validator.ensurePasswordValid(
      this.passwordService.verify(safePassword, user.passwordHash),
    );
    this.validator.ensureUserLoggedIn(user.isLoggedIn);

    user.isLoggedIn = false;
    await this.usersRepository.save(user);

    return ApiResponseFactory.success(
      undefined,
      `안녕히가세요! ${request.username}님`,
    );
  }
}
