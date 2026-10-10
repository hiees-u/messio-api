import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class UserAccessTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getToken(userFacebookId: number) {
    const token = await this.prisma.userAccessToken.findFirst({
      where: {
        userFacebook: {
          id: userFacebookId,
        },
      },
    });

    return token;
  }

  async getTokenByFacebookAccountId(fAccountIds: number[]) {
    return await this.prisma.userAccessToken.findMany({
      where: {
        userFacebookId: {
          in: fAccountIds,
        },
      },
      select: {
        userFacebookId: true,
        token: true,
      },
    });
  }
}
