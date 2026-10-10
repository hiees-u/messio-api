import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { HttpModule } from '@nestjs/axios';
import { FacebookModule } from 'src/providers/facebook/facebook.module';
import { UseCustomerRepository } from './repositories/customer.repository';

@Module({
  imports: [HttpModule, FacebookModule],
  providers: [CustomerService, UseCustomerRepository],
  exports: [CustomerService],
})
export class CustomerModule {}
