import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true,
});

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Add response interceptor to handle token refresh if needed in future
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Logic for refreshing token using refresh_token cookie would go here
    return Promise.reject(error);
  }
);

export default api;
