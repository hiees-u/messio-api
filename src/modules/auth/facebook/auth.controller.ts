import { Controller, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login/:code')
  async login(
    @Param('code') code: string,
  ): Promise<{ accessToken: string } | null> {
    const userInfo = await this.authService.login(code);
    return userInfo;
  }
  /**
   * {
   *    "sub": "1624668085461677",
   *    "id": "16",
   *    "name": "Hiếu",
   *    "iat": 1789658335,
   *    "exp": 1790263135
   * }
   */
}
