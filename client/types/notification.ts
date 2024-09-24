export interface INotification {
  sender: string;
  content: string;
  senderName: string;
  senderAvatar: string;
  seen: boolean;
  createdAt: Date;
}
