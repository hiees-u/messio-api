import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FacebookGraphClient } from '../clients/facebook-graph.client';

import type { FacebookOauthAccessTokenResponse } from '../dtos/facebook-oauth-access-token.graph.response';
import type { FacebookMeGraphResponse } from '../dtos/facebook-me.graph.response';

@Injectable()
export class FacebookUserApiGraph {
  private readonly fields = 'id,name,email,picture';
  constructor(
    private readonly configService: ConfigService,
    private readonly graphClient: FacebookGraphClient,
  ) {}

  async getMe(accessToken: string) {
    return this.graphClient.get<FacebookMeGraphResponse>('/me', {
      access_token: accessToken,
      fields: this.fields,
    });
  }

  async getUserAccessToken(
    code: string,
  ): Promise<FacebookOauthAccessTokenResponse> {
    const clientId = this.configService.get<string>('FB_APP_ID');
    const clientSecret = this.configService.get<string>('FB_APP_SECRET');
    const redirectUri = this.configService.get<string>('FB_REDIRECT_URI');

    const response = this.graphClient.get<FacebookOauthAccessTokenResponse>(
      '/v19.0/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code,
      },
    );
    return response;
  }
}
