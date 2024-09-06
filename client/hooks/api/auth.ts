import axiosClient from '@/api-client/axios-client';
import { APIResponse, ErrorResponse, ITokensResponse, ILoginPayload, IRefreshTokenPayload } from '@/types';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
  return useMutation<APIResponse<ITokensResponse>, ErrorResponse, ILoginPayload>({
    mutationFn: async payload => {
      const response: APIResponse<ITokensResponse> = await axiosClient.post('/auth/refresh', payload);
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
