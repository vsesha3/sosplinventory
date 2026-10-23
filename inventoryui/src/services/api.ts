import axios from 'axios';
import { getToken, isTokenExpired, redirectToLogin } from '../utils/tokenUtils';

const BASE_URL = '';

const LOGIN_URL = '/api/auth/login';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    // Expired JWT — don't send a request that will only fail; go to login
    if (isTokenExpired(token)) {
      redirectToLogin();
      return Promise.reject(new axios.Cancel('Session expired'));
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // 401 on the login call itself = wrong credentials — let the login page show it
    const isLoginCall = error.config?.url?.includes(LOGIN_URL);
    if (error.response?.status === 401 && !isLoginCall) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export default api;
