import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FacebookModule } from 'src/providers/facebook/facebook.module';
import { AuthModuleCommon } from 'src/common/authentication/auth.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [FacebookModule, AuthModuleCommon, UsersModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
