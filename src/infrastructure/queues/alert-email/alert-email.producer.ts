import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

import {
  ALERT_EMAIL_QUEUE,
  alertEmailJob,
  alertEmailJobIdPrefix,
} from './alert-email.constants';

@Injectable()
export class AlertEmailProducer {
  constructor(@InjectQueue(ALERT_EMAIL_QUEUE) private readonly queue: Queue) {}

  createJob(messId: string) {
    return this.queue.add(
      alertEmailJob.SEND_ALERT_EMAIL,
      { messId },
      {
        jobId: alertEmailJobIdPrefix + messId,
        attempts: 3,
        removeOnComplete: true,
        delay: 1000 * 60 * 0.5, // 30 seconds delay get setting
      },
    );
  }

  async cancelJob(jobId: string) {
    const job = await this.queue.getJob(alertEmailJobIdPrefix + jobId);
    if (job) {
      await job.remove();
    }
  }
}
