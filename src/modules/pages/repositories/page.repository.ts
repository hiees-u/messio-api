import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { FaceBookPage } from 'src/generated/prisma/client';
import { TokenEncryptionService } from 'src/infrastructure/crypto/token-encryption.service';

import type { PagesCacheType } from 'src/infrastructure/redis/pages/page-cache.type';
import type { CreatePageInput } from '../types/create-page.input';

@Injectable()
export class UsePageRepository {
  constructor(
    private prisma: PrismaService,
    private readonly tokenEncryption: TokenEncryptionService,
  ) {}

  async getPageDb(pageId: string) {
    const page: FaceBookPage | null = await this.prisma.faceBookPage.findUnique(
      {
        where: {
          pageId,
        },
      },
    );

    return page
      ? {
          ...page,
          token: this.tokenEncryption.decrypt(page.token),
        }
      : null;
  }

  private async getIdFacebookDbByFacebookId(
    userId: number,
    fAccountId: number,
  ) {
    return await this.prisma.userFacebook.findUnique({
      where: {
        userId,
        id: fAccountId,
      },
      select: {
        id: true,
      },
    });
  }

  async createFacebookPages(pages: CreatePageInput[]): Promise<FaceBookPage[]> {
    try {
      const res = await this.prisma.faceBookPage.createManyAndReturn({
        data: pages.map((page) => ({
          userFacebookId: page.userFacebookId || -1,
          pageId: page.pageId,
          name: page.name,
          tasks: page.tasks,
          token: this.tokenEncryption.encrypt(page.token),
        })),
        skipDuplicates: true,
      });
      return res;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async savePagesDb(
    userId: number,
    fAccountId: number,
    pages: PagesCacheType[],
  ): Promise<FaceBookPage[] | undefined> {
    try {
      const userFacebookId: number | undefined = (
        await this.getIdFacebookDbByFacebookId(userId, fAccountId)
      )?.id;

      return await this.prisma.faceBookPage.createManyAndReturn({
        data: pages.map((page) => ({
          userFacebookId: userFacebookId || -1,
          pageId: page.id,
          name: page.name,
          tasks: page.tasks,
          token: this.tokenEncryption.encrypt(page.token),
        })),
        skipDuplicates: true,
      });
    } catch (error) {
      console.error('Error inserting pages into database:', error);
      return [];
    }
  }

  async getPagesDb(pageIds: string[]) {
    return await this.prisma.faceBookPage.findMany({
      where: {
        pageId: {
          in: pageIds,
        },
      },
      select: {
        id: true,
      },
    });
  }

  async existPageOwnerUserId(userId: number, pageId: number) {
    const userOwnerPageId = await this.prisma.faceBookPage.findUnique({
      where: {
        id: pageId,
      },
      select: {
        userFacebook: {
          select: {
            userId: true,
          },
        },
      },
    });

    return userOwnerPageId?.userFacebook?.userId === userId;
  }
}
