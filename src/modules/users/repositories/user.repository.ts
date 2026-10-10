import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

import type { CreateUserGoogleResult } from '../types/create-google-auth.result';
import type { UpsertFacebookUserInput } from '../types/upsert-facebook-user.input';
import type { User } from 'src/generated/prisma/client';
import type { CreateUserGoogleInput } from '../types/upsert-google-auth.input';

@Injectable()
export class UseUserRepository {
  constructor(private prisma: PrismaService) {}

  async upsertFacebookUser(
    userReq: UpsertFacebookUserInput,
  ): Promise<User | null> {
    const userFacebook = await this.prisma.userFacebook.upsert({
      where: {
        facebookId: userReq.facebookId,
      },
      update: {
        name: userReq.name,
        email: userReq.email,
        picture: {
          upsert: {
            update: {
              url: userReq.url,
              height: userReq.height,
              width: userReq.width,
              isSilhouette: userReq.isSilhouette,
            },
            create: {
              url: userReq.url,
              height: userReq.height,
              width: userReq.width,
              isSilhouette: userReq.isSilhouette,
            },
          },
        },
        accessToken: {
          upsert: {
            update: {
              token: userReq.token,
              expiresAt: userReq.expiresAt,
            },
            create: {
              token: userReq.token,
              expiresAt: userReq.expiresAt,
            },
          },
        },
      },
      create: {
        facebookId: userReq.facebookId,
        name: userReq.name,
        email: userReq.email,
        user: {
          create: {
            name: userReq.name,
            email: userReq.email,
          },
        },
        picture: {
          create: {
            url: userReq.url,
            height: userReq.height,
            width: userReq.width,
            isSilhouette: userReq.isSilhouette,
          },
        },
        accessToken: {
          create: {
            token: userReq.token,
            expiresAt: userReq.expiresAt,
          },
        },
      },
      include: {
        user: true,
      },
    });

    return userFacebook.user;
  }

  async upsertGoogleAuth(
    userGoogle: CreateUserGoogleInput,
  ): Promise<CreateUserGoogleResult> {
    const upsertUser = {
      email: userGoogle.email,
      name: userGoogle.name,
    };

    return await this.prisma.googleAuth.upsert({
      where: {
        googleId: userGoogle.googleId,
      },
      update: {
        avataUrl: userGoogle.avataUrl,
        user: {
          upsert: {
            update: upsertUser,
            create: upsertUser,
          },
        },
      },
      create: {
        googleId: userGoogle.googleId,
        avataUrl: userGoogle.avataUrl || '',
        user: {
          create: upsertUser,
        },
      },
      include: {
        user: true,
      },
    });
  }
}
