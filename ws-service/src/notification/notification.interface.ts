export interface INotification {
  readonly sender: string;
  readonly receiver: string;
  readonly content: string;
  readonly senderName: string;
  readonly senderAvatar: string;
  readonly type: string;
  readonly createdAt: Date;
}

export interface IUserImage {
  userId: string;
  imageUrl: string;
  type: string;
}
