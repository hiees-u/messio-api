import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PayloadTokenInput } from './dto/payload.token.dto';

@Injectable()
export class AuthServiceCommon {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(user: PayloadTokenInput): Promise<string> {
    const payload = {
      sub: user.sub,
      id: user.id,
      name: user.name,
    };

    return this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string): Promise<PayloadTokenInput> {
    return this.jwtService.verifyAsync<PayloadTokenInput>(token);
  }
}
