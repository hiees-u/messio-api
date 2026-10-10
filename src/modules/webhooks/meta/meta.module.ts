import { Module } from '@nestjs/common';

import { MetaService } from './meta.service';
import { MetaController } from './meta.controller';
import { PagesModule } from 'src/modules/pages/pages.module';
import { ChatsModule } from 'src/modules/chats/chats.module';
import { WebsocketModule } from 'src/infrastructure/websocket/websocket.module';

import { UseCustomerRepository } from '../../chats/customer/repositories/customer.repository';

@Module({
  imports: [PagesModule, ChatsModule, WebsocketModule],
  controllers: [MetaController],
  providers: [MetaService, UseCustomerRepository],
})
export class MetaModule {}
