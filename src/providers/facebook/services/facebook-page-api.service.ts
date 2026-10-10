import { Injectable } from '@nestjs/common';

import { FacebookGraphClient } from '../clients/facebook-graph.client';

import type {
  FacebookPagesGraphResponse,
  FacebookPageGraphResponse,
} from '../dtos/facebook-page.graph.response';
import type { FacebookPageSubscribedRequest } from '../dtos/facebook-page-subscribed.response';
@Injectable()
export class FacebookPageApiGraph {
  constructor(private readonly graphClient: FacebookGraphClient) {}

  async getPages(useAccessToke: string): Promise<FacebookPageGraphResponse[]> {
    const res = await this.graphClient.get<FacebookPagesGraphResponse>(
      '/me/accounts',
      {
        access_token: useAccessToke,
      },
    );

    return res.data;
  }

  async registerPage(pageId: string, token: string) {
    const res = await this.graphClient.post<FacebookPageSubscribedRequest>(
      `/v23.0/${pageId}/subscribed_apps`,
      {},
      {
        subscribed_fields: ['messages'],
        access_token: token,
      },
    );
    return res;
  }
}
