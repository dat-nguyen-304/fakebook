export interface ICreateUser {
  readonly userId: string;
  readonly avatar: string;
  readonly fullName: string;
}

export interface IUpdateUser {
  readonly userId: string;
  readonly avatar?: string;
  readonly fullName?: string;
}
