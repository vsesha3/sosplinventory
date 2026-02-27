INSERT INTO sos_role_permissions (role_id, permission_id, is_active, created_by, created_at, is_deleted)
SELECT
    (SELECT id FROM sos_roles WHERE role_code = 'ROLE_SUPER_ADMIN'),
    id,
    1,
    'system',
    NOW(),
    0
FROM sos_permissions;