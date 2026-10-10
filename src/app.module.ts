import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { CryptoModule } from './infrastructure/crypto/crypto.module';
import { RedisModule } from './infrastructure/redis/redis.module';

import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthModuleCommon } from './common/authentication/auth.module';

import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { ChatsModule } from './modules/chats/chats.module';
import { CustomerModule } from './modules/chats/customer/customer.module';
import { FacebookModule } from './providers/facebook/facebook.module';
import { AuthModule } from './modules/auth/facebook/auth.module';
import { PagesModule } from './modules/pages/pages.module';
import { WebsocketModule } from './infrastructure/websocket/websocket.module';
import { QueuesModule } from './infrastructure/queues/queues.module';
import { GoogleModule } from './modules/auth/google/google.module';
import { WorkSpacesModule } from './modules/workspaces/workspaces.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!, 10),
        password: process.env.REDIS_PASSWORD,
      },
      prefix: 'messio-queue:',
    }),
    PrismaModule,
    CryptoModule,
    AuthModuleCommon,
    AuthModule,
    RedisModule,
    WebhooksModule,
    ChatsModule,
    CustomerModule,
    FacebookModule,
    PagesModule,
    WebsocketModule,
    QueuesModule,
    GoogleModule,
    WorkSpacesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
