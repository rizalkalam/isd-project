import { useState } from 'react';
import api, { setAccessToken } from '../../../api/client';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData);
      const { access_token } = response.data;

      setAccessToken(access_token);

      // Try to decode role information from the JWT access token (if present)
      const parseJwt = (token: string) => {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          return JSON.parse(jsonPayload);
        } catch (e) {
          return null;
        }
      };

      const payload = access_token ? parseJwt(access_token) : null;
      const role = payload?.role || payload?.roles || payload?.role_name || null;

      const userObj: any = { email, role };
      // In a real app, you might fetch the full profile from /me or /profile
      setUser(userObj);
      return userObj;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return { user, isLoading, error, login, logout };
};
