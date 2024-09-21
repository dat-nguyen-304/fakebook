import { FileWithPath } from 'react-dropzone';
import { Gender } from './user';

export interface ILoginPayload {
  username: string;
  password: string;
}

export interface IRegisterPayload {
  fullName: string;
  gender: Gender;
  username: string;
  password: string;
}

export interface IRefreshTokenPayload {
  refreshToken: string;
}

export interface IUpdateUserPayload {
  password?: string;
  biography?: string;
  fullName?: string;
  gender?: Gender;
  living?: string;
  hometown?: string;
  work?: string;
  school?: string;
}

export interface IUpdateUserImagePayload {
  image: FileWithPath;
  type: 'avatar' | 'cover';
  isPublic: boolean;
  description?: string;
}

export interface IAddFriendRequestPayload {
  friendId: number;
}
