import { Injectable } from '@nestjs/common';
import { AuthServiceCommon } from 'src/common/authentication/auth.service';
import { TokenEncryptionService } from 'src/infrastructure/crypto/token-encryption.service';
import { FacebookUserApiGraph } from 'src/providers/facebook/services/facebook-user-api.service';

import { UserService } from 'src/modules/users/user.service';

import type { FacebookOauthAccessTokenResponse } from 'src/providers/facebook/dtos/facebook-oauth-access-token.graph.response';
import type { User } from 'src/generated/prisma/browser';
import type { UpsertFacebookUserInput } from 'src/modules/users/types/upsert-facebook-user.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly authServiceCommon: AuthServiceCommon,
    private readonly facebookUserApiGraph: FacebookUserApiGraph,
    private readonly tokenEncryptionService: TokenEncryptionService,
    private readonly userService: UserService,
  ) {}

  async login(code: string): Promise<{ accessToken: string } | null> {
    const accessToken: FacebookOauthAccessTokenResponse =
      await this.facebookUserApiGraph.getUserAccessToken(code);

    const userInfo = await this.facebookUserApiGraph.getMe(
      accessToken.access_token,
    );

    let existingUser: User | null = null;

    if (userInfo) {
      const encryptedToken = this.tokenEncryptionService.encrypt(
        accessToken.access_token,
      );

      const userFacebook: UpsertFacebookUserInput = {
        facebookId: userInfo.id,
        name: userInfo.name,
        email: userInfo.email || '',
        token: encryptedToken,
        expiresAt: accessToken.expires_in
          ? new Date(Date.now() + accessToken.expires_in * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // HardCode: token expires in 30 days
        height: userInfo.picture.data.height,
        width: userInfo.picture.data.width,
        url: userInfo.picture.data.url,
        isSilhouette: userInfo.picture.data.is_silhouette,
      };

      existingUser = await this.userService.upsertFacebookUser(userFacebook);
    }

    //add permission user:admin to redis

    return {
      accessToken: await this.authServiceCommon.generateToken({
        sub: userInfo?.id || '',
        id: existingUser?.id.toString() || '',
        name: existingUser?.name || '',
      }),
    };
  }
}
