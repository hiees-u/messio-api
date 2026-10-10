import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
import { AuthModuleCommon } from 'src/common/authentication/auth.module';
import { PermissionsModule } from 'src/modules/auth/permissions/permissions.module';

@Module({
  imports: [AuthModuleCommon, PermissionsModule],
  providers: [WebsocketGateway, WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
