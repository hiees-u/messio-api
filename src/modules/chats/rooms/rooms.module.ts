import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import UseRoomRepository from './repositories/room.repository';

@Module({
  providers: [RoomsService, UseRoomRepository],
  exports: [RoomsService],
})
export class RoomsModule {}
