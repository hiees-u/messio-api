import { Module } from '@nestjs/common';
import { UseUserRepository } from './repositories/user.repository';
import { UserService } from './user.service';

@Module({
  providers: [UseUserRepository, UserService],
  exports: [UserService],
})
export class UsersModule {}
