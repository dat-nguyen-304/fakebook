import axiosClient from './axios-client';

export const authApi = {
  login: (payload: any) => {
    try {
      return axiosClient.post('/auth/signin', payload);
    } catch (error) {
      console.log({ error });
    }
  },

  refresh: (payload: { refreshToken: string }) => {
    try {
      return axiosClient.post('/auth/refresh', payload);
    } catch (error) {
      console.log({ error });
    }
  },

  register: (payload: any) => {
    try {
      return axiosClient.post('/auth/signup', payload);
    } catch (error) {
      console.log({ error });
    }
  }
};
