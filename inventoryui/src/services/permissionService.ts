import api from './api';
import type { Permission } from '../types';

export const permissionService = {
  getAll: () => api.get<Permission[]>('/api/permissions'),
  getById: (id: number) => api.get<Permission>(`/api/permissions/${id}`),
};
