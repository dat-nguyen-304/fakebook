import { APIResponse } from '@/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import config from '@/config';

const axiosClient = axios.create({
  baseURL: config.backendBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Ensures cookies are sent with requests
});

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    // Any status code that falls within the range of 2xx triggers this function
    return response.data;
  },
  async function (error: AxiosError) {
    // Check if the error is due to an unauthorized request
    const errResponse = error.response?.data as APIResponse<string>;
    if (errResponse.statusCode === 401 && errResponse.message === 'Token is invalid or has been revoked') {
      try {
        // Attempt to refresh the token
        await axios.post(
          `${config.backendBaseUrl}/auth/refresh`,
          {}, // Send an empty body, but this will include cookies
          { withCredentials: true } // Make sure cookies are sent in the refresh request
        );
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        return Promise.reject(refreshError);
      }
    }

    // For other errors, reject the promise with the error response data
    return Promise.reject(error.response?.data);
  }
);

export default axiosClient;
