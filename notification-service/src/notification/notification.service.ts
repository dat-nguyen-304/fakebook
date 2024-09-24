import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '@notification/notification.schema';
import { UserService } from '@user/user.service';
import { ICreateNotification, IGetNotifications } from './notification.interface';
import formattedResponse from './response.format';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationEvent } from './notification.event';

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
        return 'has sent you friend request.';
      case 'FRIEND_ACCEPT':
        return 'has accepted your friend request.';
      default:
        return '';
    }
  }

  async create(payload: ICreateNotification) {
    const { sender, receiver, type } = payload;
    const content = this.getContent(type);
    const user = await this.userService.findByIds([sender]);
    if (!user) {
      return formattedResponse('fail', 'User not found', undefined);
    }
    const senderAvatar = user[0].avatar;
    const senderName = user[0].fullName;

    const newNotification = new this.notificationModel({
      sender,
      receiver,
      type,
      content
    });

    await newNotification.save();

    this.wsClient.emit(
      'create-notification',
      new NotificationEvent(sender, receiver, senderName, senderAvatar, type, content, new Date())
    );
    return formattedResponse('success', undefined, newNotification);
  }

  async getNotifications(payload: IGetNotifications) {
    const { receiver, limit, skip } = payload;
    const notifications = await this.notificationModel.find({ receiver }).skip(skip).limit(limit);
    return formattedResponse('success', undefined, notifications);
  }
}
