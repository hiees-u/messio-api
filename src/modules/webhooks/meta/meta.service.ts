import { ForbiddenException, Injectable } from '@nestjs/common';

import { ChatsService } from 'src/modules/chats/chats.service';

import { FacebookWebhookVerificationRequestDto } from './dto/facebook-webhook-verification.request.dto';
import { FacebookMessageWebhookResponse } from './dto/facebook-messages-webhooks.response.dto';
import { CreateMessageInput } from 'src/modules/chats/messages/types/create-message.input';

@Injectable()
export class MetaService {
  private readonly verifyToken: string | null;
  private readonly SUBSCRIBE_MODE = 'subscribe';
  constructor(private readonly chatsService: ChatsService) {
    this.verifyToken = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN || null;
  }

  handlerWebhookMessages(body: FacebookMessageWebhookResponse) {
    console.log('Received webhook:', JSON.stringify(body));
    const psidCusomer = body.entry[0].messaging[0].sender.id;
    const pageId = body.entry[0].messaging[0].recipient.id;
    const messageType =
      body.entry[0].messaging[0].message.attachments?.[0]?.type ?? 'text';
    const message: CreateMessageInput = {
      mid: body.entry[0].messaging[0].message.mid,
      type: messageType,
      text:
        messageType !== 'text' && body.entry[0].messaging[0].message.attachments
          ? body.entry[0].messaging[0].message.attachments[0]?.payload.url
          : body.entry[0].messaging[0].message.text || '',
    };

    /**
     * upgade add in bullmq.
     */
    void this.chatsService.handlerReceiveMessage(psidCusomer, pageId, message);
  }

  handlerVerificationApiWebhook(query: FacebookWebhookVerificationRequestDto) {
    const {
      'hub.mode': mode,
      'hub.verify_token': token,
      'hub.challenge': challenge,
    } = query;

    if (mode === this.SUBSCRIBE_MODE && token === this.verifyToken) {
      return challenge;
    }
    throw new ForbiddenException();
  }
}
