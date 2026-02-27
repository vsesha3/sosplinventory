INSERT INTO sos_permissions (permission_name, permission_code, module, description, is_active, created_by, created_at, is_deleted)
VALUES
-- User Module
('View Users', 'USER_VIEW', 'USER', 'Can view users', 1, 'system', NOW(), 0),
('Create User', 'USER_CREATE', 'USER', 'Can create users', 1, 'system', NOW(), 0),
('Edit User', 'USER_EDIT', 'USER', 'Can edit users', 1, 'system', NOW(), 0),
('Delete User', 'USER_DELETE', 'USER', 'Can delete users', 1, 'system', NOW(), 0),

-- Role Module
('View Roles', 'ROLE_VIEW', 'ROLE', 'Can view roles', 1, 'system', NOW(), 0),
('Create Role', 'ROLE_CREATE', 'ROLE', 'Can create roles', 1, 'system', NOW(), 0),
('Edit Role', 'ROLE_EDIT', 'ROLE', 'Can edit roles', 1, 'system', NOW(), 0),
('Delete Role', 'ROLE_DELETE', 'ROLE', 'Can delete roles', 1, 'system', NOW(), 0),

-- Permission Module
('View Permissions', 'PERMISSION_VIEW', 'PERMISSION', 'Can view permissions', 1, 'system', NOW(), 0),
('Assign Permission', 'PERMISSION_ASSIGN', 'PERMISSION', 'Can assign permissions', 1, 'system', NOW(), 0),

-- Inventory Module
('View Inventory', 'INVENTORY_VIEW', 'INVENTORY', 'Can view inventory', 1, 'system', NOW(), 0),
('Create Inventory', 'INVENTORY_CREATE', 'INVENTORY', 'Can create inventory', 1, 'system', NOW(), 0),
('Edit Inventory', 'INVENTORY_EDIT', 'INVENTORY', 'Can edit inventory', 1, 'system', NOW(), 0),
('Delete Inventory', 'INVENTORY_DELETE', 'INVENTORY', 'Can delete inventory', 1, 'system', NOW(), 0),

-- Report Module
('View Reports', 'REPORT_VIEW', 'REPORT', 'Can view reports', 1, 'system', NOW(), 0),
('Export Reports', 'REPORT_EXPORT', 'REPORT', 'Can export reports', 1, 'system', NOW(), 0);