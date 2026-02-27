INSERT INTO sos_users (username, email, password, full_name, is_active, is_locked, created_by, created_at, is_deleted)
VALUES
(
    'superadmin',
    'superadmin@sospl.com',
    '$2a$12$eOIbDUrFQVSHgIQEbxkdFOoHh3U7YBdMoJTBgPHDHOVqoSGHAalvO',
    'Super Admin',
    1,
    0,
    'system',
    NOW(),
    0
);
-- Default password is: Admin@123
-- Password is BCrypt encoded - change immediately after first login