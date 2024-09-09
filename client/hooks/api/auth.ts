import axiosClient from '@/axios/axios-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  APIResponse,
  ErrorResponse,
  ITokensResponse,
  ILoginPayload,
  IRefreshTokenPayload,
  IRegisterResponse,
  IRegisterPayload,
  User
} from '@/types';

export const useLogin = () => {
  return useMutation<APIResponse<ITokensResponse>, ErrorResponse, ILoginPayload>({
    mutationFn: async payload => {
      const response: APIResponse<ITokensResponse> = await axiosClient.post('/auth/signin', payload);
      return response;
    }
  });
};

export const useRegister = () => {
  return useMutation<APIResponse<IRegisterResponse>, ErrorResponse, IRegisterPayload>({
    mutationFn: async payload => {
      const response: APIResponse<IRegisterResponse> = await axiosClient.post('/auth/signup', payload);
      return response;
    }
  });
};

export const useRefreshToken = () => {
  return useMutation<APIResponse<ITokensResponse>, ErrorResponse, IRefreshTokenPayload>({
    mutationFn: async payload => {
      const response: APIResponse<ITokensResponse> = await axiosClient.post('/auth/refresh', payload);
      return response;
    }
  });
};

export const useLogout = () => {
  return useMutation<APIResponse<string>, ErrorResponse>({
    mutationFn: async () => {
      const response: APIResponse<string> = await axiosClient.post('/auth/logout');
      return response;
    }
  });
};

export const useMe = () => {
  return useQuery<APIResponse<User>, ErrorResponse>({
    queryKey: ['me'],
    queryFn: async () => {
      const response: APIResponse<User> = await axiosClient.get('/auth/me');
      return response;
    }
  });
};
