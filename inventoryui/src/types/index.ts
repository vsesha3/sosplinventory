export interface User {
  id: number;
  username: string;
  email: string;
  roles: Role[];
  enabled: boolean;
  createdAt: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  roleIds: number[];
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissionIds: number[];
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  module: string;
}
