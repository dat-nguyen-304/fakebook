import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '@notification/notification.schema';
import formattedResponse from './response.format';
import { UserService } from '@user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    private userService: UserService
  ) {}

  async create(payload: any) {
    const { sender, receiver, type, content } = payload;
    const user = await this.userService.findByIds([sender]);
    const senderAvatar = user[0]?.avatar || '';

    const newNotification = new this.notificationModel({
      sender,
      receiver,
      type,
      content,
      senderAvatar
    });

    await newNotification.save();
    return formattedResponse('success', undefined, newNotification);
  }

  async getNotifications(payload: any) {
    const { receiverId, limit, skip } = payload;
    const notifications = await this.notificationModel.find({ receiver: receiverId }).skip(skip).limit(limit);
    return formattedResponse('success', undefined, notifications);
  }
}
