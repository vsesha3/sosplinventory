CREATE TABLE sos_audit_logs (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100),
    record_id BIGINT,
    action VARCHAR(50),
    old_value TEXT,
    new_value TEXT,
    performed_by VARCHAR(100),
    performed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    remarks VARCHAR(255)
);