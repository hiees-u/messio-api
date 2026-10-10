import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { PermissionsModule } from '../auth/permissions/permissions.module';

import { WorkSpacesController } from './workspaces.controller';
import { WorkSpacesService } from './workspaces.service';
import { WorkSpaceRepository } from './repositories/workspaces.repository';

@Module({
  imports: [PrismaModule, PermissionsModule],
  controllers: [WorkSpacesController],
  providers: [WorkSpacesService, WorkSpaceRepository],
  exports: [WorkSpacesService],
})
export class WorkSpacesModule {}
