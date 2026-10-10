import { Module } from '@nestjs/common';

import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';

import { FacebookModule } from 'src/providers/facebook/facebook.module';
import { CryptoModule } from 'src/infrastructure/crypto/crypto.module';

import { UserAccessTokenRepository } from './repositories/access-token.repository';
import { UsePageRepository } from './repositories/page.repository';
import { SettingModule } from './setting/setting.module';
import { PageMapper } from './pages.mapper';
import { UsersModule } from '../users/users.module';
import { AuthorizationModule } from 'src/common/authorization/authorization.module';
import { UseFacebookAccountRepository } from './repositories/facebook-account.repository';
import { WorkSpacesModule } from '../workspaces/workspaces.module';

@Module({
  imports: [
    FacebookModule,
    CryptoModule,
    SettingModule,
    UsersModule,
    WorkSpacesModule,
    AuthorizationModule,
  ],
  providers: [
    UserAccessTokenRepository,
    PagesService,
    UsePageRepository,
    PageMapper,
    UseFacebookAccountRepository,
  ],
  controllers: [PagesController],
  exports: [UsePageRepository, PagesService],
})
export class PagesModule {}
