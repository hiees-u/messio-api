import { Injectable } from '@nestjs/common';
import { UseFaceBookPage } from './repositories/facebook-page.repository';
import { UsePermissionRepository } from './repositories/permission.repository';
import { CreatePermissionInput } from './dto/create-permission.dto';
import { RedisPermissionService } from 'src/infrastructure/redis/permission/permission.service';
import { UseWorkSpaceRepository } from './repositories/workspace.repository';
import UseRoomRepository from './repositories/room.repository';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly useFaceBookPage: UseFaceBookPage,
    private readonly redisPermissionService: RedisPermissionService,
    private readonly usePermissionRepository: UsePermissionRepository,
    private readonly useWorkSpaceRepository: UseWorkSpaceRepository,
    private readonly useRoomRepository: UseRoomRepository,
  ) {}

  async hasPermissionOwnerPage(userId: number, pageId: number) {
    if (await this.redisPermissionService.hasOwnerPage(userId, pageId))
      return true;
    const result = await this.useFaceBookPage.existPageOwnerUserId(
      userId,
      pageId,
    );
    return result;
  }

  async addPermissionToWorkSpace(
    workSpaceId: number,
    userRequests: CreatePermissionInput,
  ) {
    return await this.usePermissionRepository.addPermissionToWorkSpace(
      workSpaceId,
      userRequests,
    );
  }

  async checkPermissionUserInWorkSpace(
    userId: number,
    pageId: number,
    permission: string,
  ): Promise<boolean> {
    const workSpace = await this.useWorkSpaceRepository.getWorkSpace(
      userId,
      pageId,
    );
    if (workSpace) {
      return this.checkPermissionByWorkSpaceId(workSpace.id, permission);
    }
    return false;
  }

  async checkPermissionUserInRoom(
    userId: number,
    roomId: number,
    permission: string,
  ): Promise<boolean> {
    const pageId: number =
      (await this.useRoomRepository.getRoomById(roomId))?.pageId ?? 0;

    if (pageId === 0) return false;

    const workSpace = await this.useWorkSpaceRepository.getWorkSpace(
      userId,
      pageId,
    );

    if (workSpace) {
      return this.checkPermissionByWorkSpaceId(workSpace.id, permission);
    }

    return false;
  }

  async checkPermissionByWorkSpaceId(
    workSpaceId: number,
    permission: string,
  ): Promise<boolean> {
    if (
      await this.redisPermissionService.hasPermissionWithPage(
        workSpaceId,
        permission,
      )
    ) {
      return true;
    }
    const result: boolean =
      await this.usePermissionRepository.checkPermissionUserInWorkSpace(
        permission,
        workSpaceId,
      );

    //add permission in redis
    if (result) {
      void this.redisPermissionService.addPermissionToPage(
        workSpaceId,
        permission,
      );
    }

    return result;
  }
}
