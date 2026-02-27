# SOSPL Inventory Management System - Folder Structure Setup
# Run this from inside your project root (where src/ is located)

Write-Host "Creating SOSPL IMS folder structure..." -ForegroundColor Cyan

# ─── Create Folders ───────────────────────────────────────────────
$folders = @(
    "src\pages\login",
    "src\pages\dashboard",
    "src\pages\users",
    "src\pages\roles",
    "src\pages\permissions",
    "src\components\layout",
    "src\components\common",
    "src\hooks",
    "src\services",
    "src\store",
    "src\types",
    "src\utils",
    "src\routes"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
    Write-Host "  [+] $folder" -ForegroundColor Green
}

# ─── Create Files ─────────────────────────────────────────────────

# Pages
@"
import React from 'react';

const LoginPage: React.FC = () => {
  return <div>LoginPage</div>;
};

export default LoginPage;
"@ | Set-Content "src\pages\login\LoginPage.tsx"

@"
import React from 'react';

const DashboardPage: React.FC = () => {
  return <div>DashboardPage</div>;
};

export default DashboardPage;
"@ | Set-Content "src\pages\dashboard\DashboardPage.tsx"

@"
import React from 'react';

const UsersPage: React.FC = () => {
  return <div>UsersPage</div>;
};

export default UsersPage;
"@ | Set-Content "src\pages\users\UsersPage.tsx"

@"
import React from 'react';

const RolesPage: React.FC = () => {
  return <div>RolesPage</div>;
};

export default RolesPage;
"@ | Set-Content "src\pages\roles\RolesPage.tsx"

@"
import React from 'react';

const PermissionsPage: React.FC = () => {
  return <div>PermissionsPage</div>;
};

export default PermissionsPage;
"@ | Set-Content "src\pages\permissions\PermissionsPage.tsx"

# Services
@"
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer `$`{token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
"@ | Set-Content "src\services\api.ts"

@"
import api from './api';

export interface LoginRequest { username: string; password: string; }
export interface LoginResponse { token: string; }

export const authService = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/api/auth/login', data),
  logout: () => localStorage.removeItem('token'),
};
"@ | Set-Content "src\services\authService.ts"

@"
import api from './api';
import { User, CreateUserRequest } from '../types';

export const userService = {
  getAll: () => api.get<User[]>('/api/users'),
  getById: (id: number) => api.get<User>(`/api/users/`$`{id}`),
  create: (data: CreateUserRequest) => api.post<User>('/api/users', data),
  update: (id: number, data: Partial<CreateUserRequest>) => api.put<User>(`/api/users/`$`{id}`, data),
  delete: (id: number) => api.delete(`/api/users/`$`{id}`),
};
"@ | Set-Content "src\services\userService.ts"

@"
import api from './api';
import { Role, CreateRoleRequest } from '../types';

export const roleService = {
  getAll: () => api.get<Role[]>('/api/roles'),
  getById: (id: number) => api.get<Role>(`/api/roles/`$`{id}`),
  create: (data: CreateRoleRequest) => api.post<Role>('/api/roles', data),
  update: (id: number, data: Partial<CreateRoleRequest>) => api.put<Role>(`/api/roles/`$`{id}`, data),
  delete: (id: number) => api.delete(`/api/roles/`$`{id}`),
};
"@ | Set-Content "src\services\roleService.ts"

@"
import api from './api';
import { Permission } from '../types';

export const permissionService = {
  getAll: () => api.get<Permission[]>('/api/permissions'),
  getById: (id: number) => api.get<Permission>(`/api/permissions/`$`{id}`),
};
"@ | Set-Content "src\services\permissionService.ts"

# Types
@"
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
"@ | Set-Content "src\types\index.ts"

# Hooks
@"
import { useState } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const isAuthenticated = !!token;

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return { token, isAuthenticated, login, logout };
};
"@ | Set-Content "src\hooks\useAuth.ts"

# Routes
@"
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/login/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import UsersPage from '../pages/users/UsersPage';
import RolesPage from '../pages/roles/RolesPage';
import PermissionsPage from '../pages/permissions/PermissionsPage';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/permissions" element={<PermissionsPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
"@ | Set-Content "src\routes\AppRouter.tsx"

@"
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
"@ | Set-Content "src\routes\ProtectedRoute.tsx"

# Layout
@"
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AppShell, NavLink, Text, Group, Button } from '@mantine/core';
import { IconDashboard, IconUsers, IconShield, IconKey, IconLogout } from '@tabler/icons-react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <IconDashboard size={18} /> },
  { label: 'Users',     path: '/users',     icon: <IconUsers size={18} /> },
  { label: 'Roles',     path: '/roles',     icon: <IconShield size={18} /> },
  { label: 'Permissions', path: '/permissions', icon: <IconKey size={18} /> },
];

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppShell navbar={{ width: 240, breakpoint: 'sm' }} padding="md">
      <AppShell.Navbar p="md">
        <Text fw={700} size="lg" mb="xl">SOSPL IMS</Text>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            label={item.label}
            leftSection={item.icon}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            mb={4}
          />
        ))}
        <Group mt="auto">
          <Button leftSection={<IconLogout size={16} />} variant="subtle" color="red" onClick={handleLogout} fullWidth>
            Logout
          </Button>
        </Group>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default AppLayout;
"@ | Set-Content "src\components\layout\AppLayout.tsx"

# Utils
@"
export const getToken = (): string | null => localStorage.getItem('token');

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = parseJwt(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
};
"@ | Set-Content "src\utils\tokenUtils.ts"

Write-Host ""
Write-Host "Done! All folders and files created successfully." -ForegroundColor Cyan
Write-Host ""
Write-Host "Next step - install dependencies:" -ForegroundColor Yellow
Write-Host "  yarn add @mantine/core @mantine/hooks @mantine/notifications @mantine/form @tabler/icons-react react-router-dom axios" -ForegroundColor White
Write-Host ""
Write-Host "Then update your main.tsx to wrap the app with <MantineProvider>" -ForegroundColor Yellow
