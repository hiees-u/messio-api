import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateCustomerInput } from '../types/create-customer.input';
import { Customers } from 'src/generated/prisma/client';

@Injectable()
export class UseCustomerRepository {
  constructor(private prisma: PrismaService) {}

  async findCustomer(psidInput: string): Promise<Customers | null> {
    const existingCustomer = await this.prisma.customers.findUnique({
      where: {
        psid: psidInput,
      },
    });

    if (!existingCustomer) return null;

    return existingCustomer;
  }

  async createCustomer(customerInp: CreateCustomerInput): Promise<Customers> {
    const customer = await this.prisma.customers.create({
      data: {
        name: customerInp.name,
        psid: customerInp.psid,
      },
    });
    return customer;
  }
}
