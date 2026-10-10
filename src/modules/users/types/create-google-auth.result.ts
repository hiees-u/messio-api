import { Prisma } from 'src/generated/prisma/client';

export type CreateUserGoogleResult = Prisma.GoogleAuthGetPayload<{
  include: {
    user: true;
  };
}>;
