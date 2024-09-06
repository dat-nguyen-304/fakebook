export interface User {
  id: string;
  username: string;
  fullName: string;
  biography: string;
  gender: 'MALE' | 'FEMALE';
  exp: number;
  iat: number;
}
