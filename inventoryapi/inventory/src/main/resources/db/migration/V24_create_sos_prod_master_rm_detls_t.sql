CREATE TABLE IF NOT EXISTS sos_prod_master_rm_detls_t
(
    pm_rm_detsl_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id      BIGINT               NULL,
    rm_id           BIGINT               NULL,
    mixpercentage  DECIMAL(5, 2)        NULL,
    created_by      VARCHAR(100)         NULL,
    created_at      DATETIME             NULL,
    updated_by      VARCHAR(100)         NULL,
    updated_at      DATETIME             NULL,
    is_active       TINYINT(1) DEFAULT 1 NULL,
    is_deleted      TINYINT(1) DEFAULT 0 NULL,
    deleted_by      VARCHAR(100)         NULL,
    deleted_at      DATETIME             NULL
);