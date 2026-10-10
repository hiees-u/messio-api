import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';

import { ALERT_EMAIL_QUEUE, alertEmailJob } from './alert-email.constants';

@Processor(ALERT_EMAIL_QUEUE)
export class AlertEmailProcessor extends WorkerHost {
  async process(job: Job) {
    switch (job.name) {
      case alertEmailJob.SEND_ALERT_EMAIL:
        //get mess in db -> send email (check quyền của client quản lý page này)
        console.log('TOI DANG SEND EMAIL', job.data);
        await (async () => {})();
        break;
      default:
        console.log(
          `[Alert Email Processor] Job name: ${job.name} is not recognized!.`,
        );
        break;
    }
  }
}
