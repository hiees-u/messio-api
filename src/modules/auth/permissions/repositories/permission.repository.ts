import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreatePermissionInput } from '../dto/create-permission.dto';
import { WorkSpace } from 'src/generated/prisma/client';

@Injectable()
export class UsePermissionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  addPermissionToWorkSpace(
    workSpaceId: number,
    userRequests: CreatePermissionInput,
  ): Promise<{ count: number }> {
    if (userRequests.permission && userRequests.permission.length === 0) {
      userRequests.permission = ['read'];
    }

    return this.prismaService.permission.createMany({
      data:
        userRequests.permission?.map((permission) => ({
          workSpaceId,
          permission,
        })) || [],
      skipDuplicates: true,
    });
  }

  async checkPermissionUserInWorkSpace(
    permission: string,
    workSpaceId: number,
  ): Promise<boolean> {
    const result = await this.prismaService.permission.findFirst({
      where: {
        workSpaceId,
        permission,
      },
    });
    return !!result;
  }

  async getWorkSpace(
    userId: number,
    pageId: number,
  ): Promise<WorkSpace | null> {
    return await this.prismaService.workSpace.findUnique({
      where: {
        pageId_userId: {
          pageId,
          userId,
        },
      },
    });
  }
}
