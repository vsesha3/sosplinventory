import api from './api';

export interface LoginRequest {
  usernameOrEmail: string;   // ← renamed from username
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const authService = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/api/auth/login', data),
  logout: () => localStorage.removeItem('token'),
};