import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreatePermissionInput } from 'src/modules/auth/permissions/dto/create-permission.dto';

@Injectable()
export class WorkSpaceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWorkSpacesForPage(pageId: number, users: number[]) {
    return await Promise.all(
      users.map((user) =>
        this.prisma.workSpace.upsert({
          where: {
            pageId_userId: {
              pageId: pageId,
              userId: user,
            },
          },
          create: {
            pageId: pageId,
            userId: user,
          },
          update: {},
        }),
      ),
    );
  }

  createWorkspaceForPages(
    pageIds: number[],
    userPermission: CreatePermissionInput,
  ) {
    return this.prisma.workSpace.createMany({
      data: pageIds.map((padeId: number) => ({
        pageId: padeId,
        userId: userPermission.userId,
        Permissions: {
          create: {
            permission: userPermission.permission,
          },
        },
      })),
    });
  }
}
