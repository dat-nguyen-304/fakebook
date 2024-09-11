import axiosClient from '@axios/axios-client';
import { useMutation } from '@tanstack/react-query';
import { APIResponse, ErrorResponse, User, IUpdateUserPayload } from '@types';

export const useUpdateUser = (userId: string) => {
  return useMutation<APIResponse<User>, ErrorResponse, IUpdateUserPayload>({
    mutationFn: async payload => {
      const response: APIResponse<User> = await axiosClient.patch(`/user/${userId}`, payload);
      return response;
    }
  });
};
