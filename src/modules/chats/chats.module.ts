import { Module } from '@nestjs/common';

import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';

import { RoomsModule } from './rooms/rooms.module';
import { PagesModule } from '../pages/pages.module';
import { CustomerModule } from './customer/customer.module';
import { MessagesModule } from './messages/messages.module';
import { WebsocketModule } from 'src/infrastructure/websocket/websocket.module';
import { QueuesModule } from 'src/infrastructure/queues/queues.module';
import { AuthorizationModule } from 'src/common/authorization/authorization.module';

@Module({
  imports: [
    RoomsModule,
    PagesModule,
    CustomerModule,
    MessagesModule,
    WebsocketModule,
    QueuesModule,
    AuthorizationModule,
  ],
  exports: [ChatsService],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
