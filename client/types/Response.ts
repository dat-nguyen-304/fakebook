import { AxiosError } from 'axios';

export interface APIResponse<T> {
  success: boolean;
  statusCode: string;
  message: string;
  data: T;
}

export interface ErrorResponse extends AxiosError<APIResponse<string>> {}

export interface ITokensResponse {
  refreshToken: string;
  accessToken: string;
}
