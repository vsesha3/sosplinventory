import { useState } from 'react';
import { clearAuth, getToken, hasValidToken, setAuth } from '../utils/tokenUtils';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(hasValidToken() ? getToken() : null);
  const isAuthenticated = !!token;

  const login = (newToken: string) => {
    setAuth(newToken);
    setToken(newToken);
  };

  const logout = () => {
    clearAuth();
    setToken(null);
  };

  return { token, isAuthenticated, login, logout };
};
