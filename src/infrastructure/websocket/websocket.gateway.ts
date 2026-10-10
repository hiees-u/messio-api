import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthServiceCommon } from 'src/common/authentication/auth.service';
import { PermissionsService } from 'src/modules/auth/permissions/permissions.service';

interface SocketData {
  userId: number;
}

type AuthenticatedSocket = Socket<any, any, any, SocketData>;

@WebSocketGateway()
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authServiceCommon: AuthServiceCommon,
    private readonly permissionService: PermissionsService,
  ) {}
  @WebSocketServer()
  server!: Server;

  temp = 0;

  @SubscribeMessage('message')
  handleMessage(
    client: any,
    payload: any,
    @ConnectedSocket() socket: Socket,
  ): string {
    if (!client) {
      socket.disconnect();
    }
    return 'Hello world! ' + client + ' ' + payload;
  }

  sendMessageToRoom(roomId: string, message: string) {
    this.server.to(roomId).emit('send-message', message);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.data.userId;
    if (
      await this.permissionService.checkPermissionUserInRoom(
        userId,
        Number(roomId),
        'ADMIN',
      )
    )
      await client.join(roomId);
  }

  async handleConnection(socket: AuthenticatedSocket): Promise<void> {
    try {
      const token: string = socket.handshake.auth.token as string;
      if (token) {
        const result = await this.authServiceCommon.verifyToken(token);
        console.log(result);
        this.temp = Number(result.id);
        socket.data.userId = Number(result.id);
      } else {
        socket.disconnect();
      }
    } catch (e) {
      console.log('Disconnect..! error: ', e);
      socket.disconnect();
    }
  }

  handleDisconnect(client: any): void {
    console.log('Client disconnected', client);
  }
}
