import api from './api';

export interface LoginRequest {
  usernameOrEmail: string;   // ← renamed from username
  password: string;
}




export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    tokenType: string;
    userId: number;
    username: string;
    email: string;
    fullName: string;
    roles: string[];
    permissions: string[];
    expiresIn: number;
  };
}

export const authService = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/api/auth/login', data),
  logout: () => localStorage.removeItem('token'),
};