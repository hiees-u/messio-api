import { Module } from '@nestjs/common';
import { PermissionGuard } from 'src/common/authorization/guards/permission.guard';
import { PermissionsModule } from 'src/modules/auth/permissions/permissions.module';

@Module({
  imports: [PermissionsModule],
  providers: [PermissionGuard],
  exports: [PermissionGuard, PermissionsModule],
})
export class AuthorizationModule {}
