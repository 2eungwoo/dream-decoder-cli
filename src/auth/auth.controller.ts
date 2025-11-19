import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterRequestDto,
  LoginRequestDto,
  LogoutRequestDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(@Body() credentials: RegisterRequestDto) {
    return this.authService.register(credentials);
  }

  @Post('login')
  public async login(@Body() credentials: LoginRequestDto) {
    return this.authService.login(credentials);
  }

  @Post('logout')
  public async logout(@Body() credentials: LogoutRequestDto) {
    return this.authService.logout(credentials);
  }
}
