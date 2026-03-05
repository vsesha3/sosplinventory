import api from './api';
import type { User, CreateUserRequest } from '../types';

export const userService = {
  getAll: () => api.get<User[]>('/api/users'),
  getById: (id: number) => api.get<User>(`/api/users/${id}`),
  create: (data: CreateUserRequest) => api.post<User>('/api/users', data),
  update: (id: number, data: Partial<CreateUserRequest>) => api.put<User>(`/api/users/${id}`, data),
  delete: (id: number) => api.delete(`/api/users/${id}`),
};
