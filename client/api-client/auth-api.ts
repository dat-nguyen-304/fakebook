import axiosClient from './axios-client';

export const authApi = {
    login: (payload: any) => {
        try {
            return axiosClient.post('/auth/signin', payload);
        } catch (error) {
            console.log({ error });
        }
    },

    refresh: (refreshToken: string) => {
        try {
            return axiosClient.post('/auth/refresh', refreshToken);
        } catch (error) {
            console.log({ error });
        }
    },

    register: (payload: any) => {
        try {
            console.log(payload.gender);
            return axiosClient.post('/auth/signup', payload);
        } catch (error) {
            console.log({ error });
        }
    }
};
