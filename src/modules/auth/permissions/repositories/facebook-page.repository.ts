import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class UseFaceBookPage {
  constructor(private readonly prismaService: PrismaService) {}

  existPageOwnerUserId(userId: number, pageId: number): Promise<boolean> {
    return this.prismaService.faceBookPage
      .findFirst({
        where: {
          id: pageId,
          userFacebook: {
            userId: userId,
          },
        },
      })
      .then((page) => !!page);
  }
}
