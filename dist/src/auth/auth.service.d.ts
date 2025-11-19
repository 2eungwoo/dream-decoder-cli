import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { AuthValidator } from './auth.validator';
import { PasswordService } from './password.service';
import { RegisterRequestDto } from './dto/register-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LogoutRequestDto } from './dto/logout-request.dto';
export declare class AuthService {
    private readonly validator;
    private readonly passwordService;
    private readonly usersRepository;
    constructor(validator: AuthValidator, passwordService: PasswordService, usersRepository: Repository<User>);
    register(request: RegisterRequestDto): Promise<import("../shared/dto/api-response.dto").ApiSuccessResponse<undefined>>;
    login(request: LoginRequestDto): Promise<import("../shared/dto/api-response.dto").ApiSuccessResponse<undefined>>;
    logout(request: LogoutRequestDto): Promise<import("../shared/dto/api-response.dto").ApiSuccessResponse<undefined>>;
}
