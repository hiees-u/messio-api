import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

import type { CreateMessageInput } from '../types/create-message.input';

@Injectable()
export default class UseMessagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(message: CreateMessageInput, roomId: number) {
    return await this.prisma.messages.create({
      data: {
        mid: message.mid,
        roomId: roomId,
        senders: [],
        text: message.text,
        type: message.type,
      },
    });
  }

  async updateMessageSender(
    messageId: number,
    senders: number[],
  ): Promise<number[]> {
    const result = await this.prisma.$queryRaw<{ senders: number[] }[]>`
      UPDATE "Messages"
      SET senders = (
        SELECT ARRAY(
          SELECT DISTINCT unnest(
            COALESCE(senders, ARRAY[]::integer[]) || ${senders}::integer[]
          )
        )
      )
      WHERE id = ${messageId}
      RETURNING senders;
    `;

    return result[0].senders || null;
  }
}
