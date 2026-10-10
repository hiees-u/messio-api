import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { UseFaceBookPage } from './repositories/facebook-page.repository';
import { UsePermissionRepository } from './repositories/permission.repository';
import { UseWorkSpaceRepository } from './repositories/workspace.repository';
import UseRoomRepository from './repositories/room.repository';

@Module({
  imports: [],
  providers: [
    PermissionsService,
    UseFaceBookPage,
    UsePermissionRepository,
    UseWorkSpaceRepository,
    UseRoomRepository,
  ],
  exports: [PermissionsService],
})
export class PermissionsModule {}
