import axiosClient from './axios-client';

export const authApi = {
  login: (payload: any) => {
    return axiosClient.post('/auth/signin', payload);
  },

  refresh: (payload: { refreshToken: string }) => {
    return axiosClient.post('/auth/refresh', payload);
  },

  register: (payload: any) => {
    return axiosClient.post('/auth/signup', payload);
  }
};
