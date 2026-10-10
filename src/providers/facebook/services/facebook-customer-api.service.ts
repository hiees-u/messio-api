import { Injectable } from '@nestjs/common';

import { FacebookGraphClient } from '../clients/facebook-graph.client';

import type { FacebookPSIDGraphResponse } from 'src/providers/facebook/dtos/facebook-psid.graph.response';

@Injectable()
export class FacebookCustomerApiGraph {
  constructor(private readonly graphClient: FacebookGraphClient) {}

  async getPageCustomer(
    psid: string,
    pageAccessToken: string,
    fields?: string,
  ): Promise<FacebookPSIDGraphResponse> {
    const customer = await this.graphClient.get<FacebookPSIDGraphResponse>(
      `/${psid}`,
      {
        fields: fields || 'name,profile_pic,locale,timezone,gender',
        access_token: pageAccessToken,
      },
    );

    return customer;
  }
}
