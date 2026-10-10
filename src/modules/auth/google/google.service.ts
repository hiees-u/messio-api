import { Injectable } from '@nestjs/common';
import { AuthServiceCommon } from 'src/common/authentication/auth.service';
import { PayloadTokenInput } from 'src/common/authentication/dto/payload.token.dto';

import { UserService } from 'src/modules/users/user.service';

import type { ReuqestWithUserGoogle } from 'src/common/authentication/dto/request-with-user-google.type';
import type { CreateUserGoogleResult } from 'src/modules/users/types/create-google-auth.result';

@Injectable()
export class GoogleService {
  constructor(
    private readonly userService: UserService,
    private readonly authServiceCommon: AuthServiceCommon,
  ) {}

  async handlerAuthGoogle(user: ReuqestWithUserGoogle) {
    const userWithGoogle: CreateUserGoogleResult =
      await this.userService.upsertGoogleAuth(user.user);

    const payloadJWT: PayloadTokenInput = {
      id: userWithGoogle.user.id.toString(),
      name: userWithGoogle.user.name,
      sub: userWithGoogle.googleId,
    };

    const tokenJwt = await this.authServiceCommon.generateToken(payloadJWT);

    console.log(tokenJwt);
  }
}
