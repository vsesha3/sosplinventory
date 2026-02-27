CREATE TABLE IF NOT EXISTS sos_product_group_master (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_group_id INT NOT NULL UNIQUE,
    group_name VARCHAR(30),
    ch_head_no INT,
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