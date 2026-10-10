import { Injectable } from '@nestjs/common';

import { UseCustomerRepository } from './repositories/customer.repository';
import { FacebookCustomerApiGraph } from 'src/providers/facebook/services/facebook-customer-api.service';

import type { FindOrCreateResult } from 'src/common/types/find-or-create-result.type';
import type { FacebookPSIDGraphResponse } from '../../../providers/facebook/dtos/facebook-psid.graph.response';
import type { Customers } from 'src/generated/prisma/client';

@Injectable()
export class CustomerService {
  constructor(
    private readonly useCustomerRepository: UseCustomerRepository,
    private readonly facebookCustomerApiGraph: FacebookCustomerApiGraph,
  ) {}

  async findOrCreatePageCustomer(
    psid: string,
    pageAccessToken: string | null = null,
  ): Promise<FindOrCreateResult<Customers | null>> {
    let existingCustomer: Customers | null =
      (await this.useCustomerRepository.findCustomer(psid)) || null;

    if (existingCustomer) {
      return {
        data: existingCustomer,
        created: false,
      };
    }

    if (pageAccessToken) {
      const cusomer: FacebookPSIDGraphResponse =
        await this.facebookCustomerApiGraph.getPageCustomer(
          psid,
          pageAccessToken,
        );

      if (cusomer) {
        existingCustomer = await this.useCustomerRepository.createCustomer({
          psid: cusomer.id,
          name: cusomer.name || cusomer?.first_name + ' ' + cusomer?.last_name,
        });
      }
    }

    return {
      data: existingCustomer,
      created: true,
    };
  }
}
