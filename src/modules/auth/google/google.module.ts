import { Module } from '@nestjs/common';

import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { AuthModuleCommon } from 'src/common/authentication/auth.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [AuthModuleCommon, AuthModuleCommon, UsersModule],
  controllers: [GoogleController],
  providers: [GoogleService],
})
export class GoogleModule {}
