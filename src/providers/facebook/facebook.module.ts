import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { FacebookGraphClient } from './clients/facebook-graph.client';

import { FacebookUserApiGraph } from './services/facebook-user-api.service';
import { FacebookPageApiGraph } from './services/facebook-page-api.service';
import { FacebookCustomerApiGraph } from './services/facebook-customer-api.service';

@Module({
  imports: [HttpModule],
  providers: [
    FacebookUserApiGraph,
    FacebookPageApiGraph,
    FacebookGraphClient,
    FacebookCustomerApiGraph,
  ],
  exports: [
    FacebookUserApiGraph,
    FacebookPageApiGraph,
    FacebookCustomerApiGraph,
  ],
})
export class FacebookModule {}
