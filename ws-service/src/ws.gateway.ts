import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost'
  },
  namespace: 'upload-image'
})
export class WsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    console.log(`User ${userId} joined`);
    client.join(userId);
  }

  notifyImageReady(userId: string, imageUrl: string) {
    this.server.to(userId).emit('imageReady', { imageUrl });
  }
}
