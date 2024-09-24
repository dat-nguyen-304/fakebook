import { Document } from 'mongoose';

export interface INotification extends Document {
  readonly receiverId: string;
  readonly senderId: string;
  readonly content: string;
  readonly senderAvatar: string;
  readonly type: string;
  readonly seen: boolean;
  readonly createdAt: Date;
}

export interface ICreateNotification {
  readonly receiver: string;
  readonly sender: string;
  readonly type: string;
}

export interface IGetNotifications {
  readonly receiver: string;
  readonly limit: number;
  readonly skip: number;
}
