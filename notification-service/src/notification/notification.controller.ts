import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { ICreateNotification, IGetNotifications } from './notification.interface';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('get-notifications')
  async getNotifications(payload: IGetNotifications) {
    return this.notificationService.getNotifications(payload);
  }

  @EventPattern('create-notification')
  async createNotification(payload: ICreateNotification) {
    return this.notificationService.create(payload);
  }
}
