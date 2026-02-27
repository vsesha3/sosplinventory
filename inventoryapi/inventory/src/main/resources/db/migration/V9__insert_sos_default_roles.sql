INSERT INTO sos_roles (role_name, role_code, description, is_active, created_by, created_at, is_deleted)
VALUES
('Super Admin', 'ROLE_SUPER_ADMIN', 'Has full access to everything', 1, 'system', NOW(), 0),
('Admin', 'ROLE_ADMIN', 'Has admin level access', 1, 'system', NOW(), 0),
('Manager', 'ROLE_MANAGER', 'Has manager level access', 1, 'system', NOW(), 0),
('User', 'ROLE_USER', 'Has standard user access', 1, 'system', NOW(), 0),
('Guest', 'ROLE_GUEST', 'Has read only access', 1, 'system', NOW(), 0);