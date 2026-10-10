import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { get } from 'lodash';
import { Reflector } from '@nestjs/core';

import { PermissionsService } from '../../../modules/auth/permissions/permissions.service';

import { RequestWithUser } from 'src/common/authentication/dto/request-with-user.type';
import {
  PERMISSION_KEY,
  PermissionMetadata,
} from '../decorators/permissions.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let result: boolean = false;
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userId: number = Number(request.user.id);

    const metadata = this.reflector.get<PermissionMetadata>(
      PERMISSION_KEY,
      context.getHandler(),
    );

    if (metadata.field) {
      const pageId: number = Number(get(request, metadata.field));
      result = await this.permissionsService.checkPermissionUserInWorkSpace(
        userId,
        pageId,
        metadata.permission,
      );
    }

    return result;
  }
}
