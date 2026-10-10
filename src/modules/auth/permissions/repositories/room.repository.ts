import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export default class UseRoomRepository {
  constructor(private prisma: PrismaService) {}

  async getRoomById(id: number) {
    return await this.prisma.rooms.findUnique({
      where: {
        id,
      },
    });
  }
}
