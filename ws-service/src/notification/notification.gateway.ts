import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { INotification, IUserImage } from './notification.interface';

@WebSocketGateway(4000, {
  cors: {
    origin: 'http://localhost'
  },
  namespace: 'notification'
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    console.log(`User ${userId} joined`);
    client.join(userId);
  }

  notifyImageReady(data: IUserImage) {
    this.server.to(data.userId).emit('image-ready', { imageUrl: data.imageUrl, type: data.type });
  }

  notifyNewNotification(payload: INotification) {
    this.server.to(payload.receiver).emit('new-notification', payload);
  }
}
