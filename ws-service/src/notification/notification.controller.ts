import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationGateway } from './notification.gateway';
import { INotification, IUserImage } from './notification.interface';

@Controller()
export class NotificationController {
  constructor(private readonly NotificationGateway: NotificationGateway) {}

  @EventPattern('image-ready')
  handleImageReady(@Payload() data: IUserImage) {
    console.log('Received imageReady event:', data);
    this.NotificationGateway.notifyImageReady(data);
  }

  @EventPattern('create-notification')
  handleFriendRequest(@Payload() data: INotification) {
    console.log('Received notification event:', data);
    this.NotificationGateway.notifyNewNotification(data);
  }
}
