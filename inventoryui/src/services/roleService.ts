import api from './api';
import { Role, CreateRoleRequest } from '../types';

export const roleService = {
  getAll: () => api.get<Role[]>('/api/roles'),
  getById: (id: number) => api.get<Role>(`/api/roles/${id}`),
  create: (data: CreateRoleRequest) => api.post<Role>('/api/roles', data),
  update: (id: number, data: Partial<CreateRoleRequest>) => api.put<Role>(`/api/roles/${id}`, data),
  delete: (id: number) => api.delete(`/api/roles/${id}`),
};
