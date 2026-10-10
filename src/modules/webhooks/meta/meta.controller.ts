import type { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { MetaService } from './meta.service';
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';

import { WebsocketService } from 'src/infrastructure/websocket/websocket.service';

import type { FacebookMessageWebhookResponse } from './dto/facebook-messages-webhooks.response.dto';
import type { FacebookWebhookVerificationRequestDto } from './dto/facebook-webhook-verification.request.dto';

@ApiTags('Webhooks')
@Controller('webhooks/meta')
export class MetaController {
  constructor(
    private readonly metaService: MetaService,
    private readonly websocketService: WebsocketService,
  ) {}

  @Get()
  getMetaWebhooks(
    @Query() query: FacebookWebhookVerificationRequestDto,
    @Res() res: Response,
  ) {
    const result = this.metaService.handlerVerificationApiWebhook(query);

    return res.status(200).send(result);
  }

  @Post()
  postWebhooks(
    @Body() body: FacebookMessageWebhookResponse,
    @Res() res: Response,
  ) {
    this.metaService.handlerWebhookMessages(body);
    return res.sendStatus(200);
  }

  @Post('SendMessage')
  sendMessageToClient() {
    this.websocketService.sendMessageToRoom(
      'room-1033068249897403',
      'Hello from server',
    );
  }
}
