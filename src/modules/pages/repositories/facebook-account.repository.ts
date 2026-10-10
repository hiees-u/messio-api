import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

export class UseFacebookAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getFacebookAccountIdByUserId(userId: number) {
    const facebookAccount = await this.prisma.userFacebook.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });
    return facebookAccount.map((fa) => fa.id);
  }
}
