import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('get_notifications')
  async getNotifications(getNotificationsDto: any) {
    return this.notificationService.getNotifications(getNotificationsDto);
  }

  @EventPattern('create_notification')
  async createNotification(createNotificationDto: any) {
    return this.notificationService.create(createNotificationDto);
  }
}
