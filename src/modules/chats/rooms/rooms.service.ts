import { Injectable } from '@nestjs/common';

import UseRoomRepository from './repositories/room.repository';
import { Rooms } from 'src/generated/prisma/browser';

@Injectable()
export class RoomsService {
  constructor(private readonly useRoomRepository: UseRoomRepository) {}

  async getRoomDb(pageId: number, customerId: number): Promise<Rooms | null> {
    return await this.useRoomRepository.getRoom(pageId, customerId);
  }

  async createRoomDb(
    pageId: number,
    customerId: number,
  ): Promise<Rooms | null> {
    return await this.useRoomRepository.createRoom(pageId, customerId);
  }
}
