import { Injectable } from '@nestjs/common';

import { WorkSpaceRepository } from './repositories/workspaces.repository';
import { PermissionsService } from '../auth/permissions/permissions.service';

import type { CreateWorkSpaceInput } from './types/create-workspace.input';
import type { CreatePermissionInput } from '../auth/permissions/dto/create-permission.dto';

@Injectable()
export class WorkSpacesService {
  constructor(
    private readonly useWorkSPaceRepository: WorkSpaceRepository,
    private readonly permissionsService: PermissionsService,
  ) {}

  async assignUsersToPage(request: CreateWorkSpaceInput) {
    const workSpace = await this.useWorkSPaceRepository.createWorkSpacesForPage(
      request.pageId,
      request.userRequests.map((userRequest) => userRequest.userId),
    );

    workSpace.map((ws) => {
      const userId = ws.userId;
      const permission = request.userRequests.find(
        (userRequest) => userRequest.userId === userId,
      );

      if (permission) {
        void this.permissionsService.addPermissionToWorkSpace(
          ws.id,
          permission,
        );
      }
    });

    return workSpace;
  }

  assignUserToPages(pageIds: number[], user: CreatePermissionInput) {
    return this.useWorkSPaceRepository.createWorkspaceForPages(pageIds, user);
  }
}
