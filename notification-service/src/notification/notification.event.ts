export class NotificationEvent {
  constructor(
    public readonly sender: string,
    public readonly receiver: string,
    public readonly senderName: string,
    public readonly senderAvatar: string,
    public readonly type: string,
    public readonly content: string,
    public readonly createdAt: Date
  ) {}

  toString() {
    return JSON.stringify({
      sender: this.sender,
      receiver: this.receiver,
      senderName: this.senderName,
      senderAvatar: this.senderAvatar,
      type: this.type,
      content: this.content,
      createdAt: this.createdAt
    });
  }
}
