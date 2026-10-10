import { Injectable } from '@nestjs/common';

import UseMessagesRepository from './repositories/messages.repository';
import { CreateMessageInput } from './types/create-message.input';

@Injectable()
export class MessagesService {
  constructor(private readonly useMessagesRepository: UseMessagesRepository) {}

  async createMessage(message: CreateMessageInput, roomId: number) {
    return await this.useMessagesRepository.createMessage(message, roomId);
  }
}
