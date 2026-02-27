CREATE TABLE sos_permissions (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL UNIQUE,
    permission_code VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(100),
    description VARCHAR(255),
    is_active TINYINT(1) DEFAULT 1,
    -- Audit Columns
    created_by VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT(1) DEFAULT 0,
    deleted_by VARCHAR(100),
    deleted_at DATETIME
);