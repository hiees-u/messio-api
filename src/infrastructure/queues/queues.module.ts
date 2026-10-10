import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AlertEmailProducer } from './alert-email/alert-email.producer';
import { AlertEmailProcessor } from './alert-email/alert-email.processor';
import { ALERT_EMAIL_QUEUE } from './alert-email/alert-email.constants';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'queue',
      },
      {
        name: ALERT_EMAIL_QUEUE,
      },
    ),
  ],
  exports: [AlertEmailProducer],
  providers: [AlertEmailProducer, AlertEmailProcessor],
})
export class QueuesModule {}
