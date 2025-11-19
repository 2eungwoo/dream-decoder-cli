import { AuthService } from './auth.service';
import { RegisterRequestDto, LoginRequestDto, LogoutRequestDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(credentials: RegisterRequestDto): Promise<import("../shared/dto/api-response.dto").ApiSuccessResponse<undefined>>;
    login(credentials: LoginRequestDto): Promise<import("../shared/dto/api-response.dto").ApiSuccessResponse<undefined>>;
    logout(credentials: LogoutRequestDto): Promise<import("../shared/dto/api-response.dto").ApiSuccessResponse<undefined>>;
}
