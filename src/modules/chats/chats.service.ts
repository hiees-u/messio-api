import { Injectable } from '@nestjs/common';

import { PagesService } from '../pages/pages.service';
import { CustomerService } from './customer/customer.service';
import { RoomsService } from './rooms/rooms.service';
import { MessagesService } from './messages/messages.service';
import { WebsocketService } from 'src/infrastructure/websocket/websocket.service';
import { AlertEmailProducer } from 'src/infrastructure/queues/alert-email/alert-email.producer';

import { FindOrCreateResult } from 'src/common/types/find-or-create-result.type';
import { CreateMessageInput } from './messages/types/create-message.input';
import UseMessagesRepository from './messages/repositories/messages.repository';
import { Customers, Rooms } from 'src/generated/prisma/client';

@Injectable()
export class ChatsService {
  constructor(
    private readonly pagesService: PagesService,
    private readonly customerService: CustomerService,
    private readonly roomsService: RoomsService,
    private readonly messagesService: MessagesService,
    private readonly websocketService: WebsocketService,
    private readonly useMessagesRepository: UseMessagesRepository,
    private readonly alertEmailProducer: AlertEmailProducer,
  ) {}

  async handlerReceiveMessage(
    psidCusomer: string,
    pageId: string,
    message: CreateMessageInput,
  ) {
    const pageRecipient = await this.pagesService.getPageDb(pageId);

    if (!pageRecipient) {
      return '';
    }

    const customerFindOrCreateResult: FindOrCreateResult<Customers | null> =
      await this.customerService.findOrCreatePageCustomer(
        psidCusomer,
        pageRecipient?.token || null,
      );

    if (!customerFindOrCreateResult.data?.id) {
      return '';
    }

    const room: Rooms | null = customerFindOrCreateResult.created
      ? await this.roomsService.createRoomDb(
          pageRecipient?.id,
          customerFindOrCreateResult.data?.id,
        )
      : await this.roomsService.getRoomDb(
          pageRecipient?.id,
          customerFindOrCreateResult.data?.id,
        );

    if (room !== null) {
      const { id: messageId } = await this.messagesService.createMessage(
        message,
        room.id,
      );

      void this.alertEmailProducer.createJob(String(messageId));

      this.websocketService.sendMessageToRoom(
        `room-${pageRecipient.pageId}`,
        message.text,
      );
    }
  }

  async handlerSendedMessage(clientId: number, messagesId: number) {
    //verifi message thuộc page mà client này quản lý hay không?

    void this.alertEmailProducer.cancelJob(String(messagesId));

    const mes: number[] = await this.useMessagesRepository.updateMessageSender(
      messagesId,
      [clientId],
    );
    return mes.includes(clientId);
  }
}
