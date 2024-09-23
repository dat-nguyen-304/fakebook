import { Document } from 'mongoose';

export interface Notification extends Document {
  readonly receiverId: string;
  readonly senderId: string;
  readonly message: string;
  readonly senderAvatar: string;
  readonly type: string;
  readonly read: boolean;
  readonly createdAt: Date;
}
