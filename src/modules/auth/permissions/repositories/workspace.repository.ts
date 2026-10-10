import { Injectable } from '@nestjs/common';
import { WorkSpace } from 'src/generated/prisma/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class UseWorkSpaceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkSpace(
    userId: number,
    pageId: number,
  ): Promise<WorkSpace | null> {
    return await this.prisma.workSpace.findUnique({
      where: {
        pageId_userId: {
          pageId,
          userId,
        },
      },
    });
  }
}
