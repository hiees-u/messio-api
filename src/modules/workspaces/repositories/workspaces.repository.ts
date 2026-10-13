import { Injectable } from '@nestjs/common';
import { PermissionCreateManyInput } from 'src/generated/prisma/internal/prismaNamespaceBrowser';
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

  async createWorkspaceForPages(
    pageIds: number[],
    userPermission: CreatePermissionInput,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const workspaces = await Promise.all(
        pageIds.map((pageId) =>
          tx.workSpace.create({
            data: {
              pageId,
              userId: userPermission.userId,
            },
          }),
        ),
      );

      await tx.permission.createMany({
        data: workspaces.map((workspace) => ({
          workSpaceId: workspace.id,
          permission: userPermission.permission,
        })) as PermissionCreateManyInput[],
      });

      return workspaces;
    });
  }
}
