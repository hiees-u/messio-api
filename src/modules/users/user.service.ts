import { Injectable } from '@nestjs/common';

import { User } from 'src/generated/prisma/client';
import { UseUserRepository } from './repositories/user.repository';
import { UpsertFacebookUserInput } from './types/upsert-facebook-user.input';
import { CreateUserGoogleInput } from './types/upsert-google-auth.input';
import { CreateUserGoogleResult } from './types/create-google-auth.result';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UseUserRepository) {}

  async upsertFacebookUser(
    userInput: UpsertFacebookUserInput,
  ): Promise<User | null> {
    return this.userRepository.upsertFacebookUser(userInput);
  }

  async upsertGoogleAuth(
    userInput: CreateUserGoogleInput,
  ): Promise<CreateUserGoogleResult> {
    return this.userRepository.upsertGoogleAuth(userInput);
  }
}
