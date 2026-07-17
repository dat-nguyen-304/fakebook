export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  cover: string;
  gender: Gender;
  biography?: string;
  living?: string;
  hometown?: string;
  work?: string;
  school?: string;
  exp: number;
  iat: number;
}
