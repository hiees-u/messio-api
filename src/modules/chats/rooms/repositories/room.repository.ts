import { Injectable } from '@nestjs/common';
import { Rooms } from 'src/generated/prisma/client';

import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export default class UseRoomRepository {
  constructor(private prisma: PrismaService) {}

  async getRoom(pageId: number, customerId: number): Promise<Rooms | null> {
    return await this.prisma.rooms.findUnique({
      where: {
        pageId_customerId: {
          pageId,
          customerId,
        },
      },
    });
  }

  async createRoom(pageId: number, customerId: number): Promise<Rooms | null> {
    return await this.prisma.rooms.create({
      data: {
        pageId: pageId,
        customerId: customerId,
      },
    });
  }
}
