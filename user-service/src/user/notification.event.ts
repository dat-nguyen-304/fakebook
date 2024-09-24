export class CreateUserEvent {
  constructor(
    public readonly userId: string,
    public readonly fullName: string,
    public readonly avatar: string
  ) {}

  toString() {
    return JSON.stringify({
      userId: this.userId,
      fullName: this.fullName,
      avatar: this.avatar
    });
  }
}

export class UpdateUserEvent {
  constructor(
    public readonly userId: string,
    public readonly fullName: string | null,
    public readonly avatar: string | null
  ) {}

  toString() {
    return JSON.stringify({
      userId: this.userId,
      fullName: this.fullName,
      avatar: this.avatar
    });
  }
}

export class FriendRequestEvent {
  public readonly type: string = 'FRIEND_REQUEST';

  constructor(
    public readonly sender: string,
    public readonly receiver: string
  ) {}

  toString() {
    return JSON.stringify({
      sender: this.sender,
      receiver: this.receiver,
      type: this.type
    });
  }
}

export class FriendAcceptEvent {
  public readonly type: string = 'FRIEND_ACCEPT';

  constructor(
    public readonly sender: string,
    public readonly receiver: string
  ) {}

  toString() {
    return JSON.stringify({
      sender: this.sender,
      receiver: this.receiver,
      type: this.type
    });
  }
}
