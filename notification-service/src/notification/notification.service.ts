import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '@notification/notification.schema';
import { UserService } from '@user/user.service';
import { ICreateNotification, IGetNotifications } from './notification.interface';
import formattedResponse from './response.format';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @Inject('WS_SERVICE') private readonly wsClient: ClientProxy,
    private userService: UserService
  ) {}

  getContent(type: string) {
    switch (type) {
      case 'FRIEND_REQUEST':
        return 'You have a new friend request';
      case 'FRIEND_ACCEPT':
        return 'Your friend request has been accepted';
      default:
        return '';
    }
  }

  async create(payload: ICreateNotification) {
    const { sender, receiver, type } = payload;
    const content = this.getContent(type);
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
    this.wsClient.emit('create-notification', newNotification);
    return formattedResponse('success', undefined, newNotification);
  }

  async getNotifications(payload: IGetNotifications) {
    const { receiver, limit, skip } = payload;
    const notifications = await this.notificationModel.find({ receiver }).skip(skip).limit(limit);
    return formattedResponse('success', undefined, notifications);
  }
}
