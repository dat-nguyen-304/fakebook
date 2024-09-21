import axiosClient from '@axios/axios-client';
import axiosFormData from '@axios/axios-form-data';
import { useMutation, useQuery } from '@tanstack/react-query';
import { APIResponse, ErrorResponse, User, IUpdateUserPayload, IUpdateUserImagePayload } from '@types';

export const useMe = () => {
  return useQuery<User, ErrorResponse>({
    queryKey: ['me'],
    queryFn: async () => {
      const response: APIResponse<User> = await axiosClient.get('/user/me');
      return response.data;
    }
  });
};

export const useUpdateUser = (userId: string) => {
  return useMutation<APIResponse<User>, ErrorResponse, IUpdateUserPayload>({
    mutationFn: async payload => {
      const response: APIResponse<User> = await axiosClient.patch(`/user/${userId}`, payload);
      return response;
    }
  });
};

export const useUpdateUserImage = (userId: string) => {
  return useMutation<APIResponse<User>, ErrorResponse, IUpdateUserImagePayload>({
    mutationFn: async payload => {
      const { image, type, isPublic, description } = payload;
      const formData = new FormData();
      formData.append('image', image);
      formData.append('type', type);
      formData.append('isPublic', String(isPublic));
      if (isPublic && description) formData.append('description', description);
      const response: APIResponse<User> = await axiosFormData.post(`/user/image/${userId}`, payload);
      return response;
    }
  });
};

export const useAllUsers = () => {
  return useQuery<User[], ErrorResponse>({
    queryKey: ['all-user'],
    queryFn: async () => {
      const response: APIResponse<User[]> = await axiosClient.get('/user');
      return response.data;
    }
  });
};

export const useFriendSuggestions = (userId: string) => {
  return useQuery<User[], ErrorResponse>({
    queryKey: ['all-user'],
    queryFn: async () => {
      const response: APIResponse<User[]> = await axiosClient.get(`/user/friend-suggestions/${userId}`);
      return response.data;
    }
  });
};

export const useSendFriendRequest = (userId: string) => {
  return useMutation<APIResponse<User>, ErrorResponse, { friendId: string }>({
    mutationFn: async payload => {
      const response: APIResponse<User> = await axiosClient.post(`/user/send-friend-request/${userId}`, payload);
      return response;
    }
  });
};
