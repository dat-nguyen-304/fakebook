export interface ILoginPayload {
  username: string;
  password: string;
}

export interface IRegisterPayload {
  fullName: string;
  gender: 'MALE' | 'FEMALE';
  username: string;
  password: string;
}

export interface IRefreshTokenPayload {
  refreshToken: string;
}
