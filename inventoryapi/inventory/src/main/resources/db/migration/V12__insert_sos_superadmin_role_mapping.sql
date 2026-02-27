INSERT INTO sos_user_roles (user_id, role_id, is_active, created_by, created_at, is_deleted)
VALUES (
    (SELECT id FROM sos_users WHERE username = 'superadmin'),
    (SELECT id FROM sos_roles WHERE role_code = 'ROLE_SUPER_ADMIN'),
    1,
    'system',
    NOW(),
    0
);