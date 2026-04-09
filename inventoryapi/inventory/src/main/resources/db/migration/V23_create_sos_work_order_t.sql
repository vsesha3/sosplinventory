CREATE TABLE IF NOT EXISTS sos_work_order_t
(
    wo_id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    po_id           BIGINT               NULL,
    plant           VARCHAR(25)          NULL,
    product_id      BIGINT               NULL,
    qty             DECIMAL(11, 2)       NULL,
    per_unit_rate   DECIMAL(11, 2)       NULL,
    wo_code         VARCHAR(250)         NULL,
    pm_id           BIGINT               NULL,
    line_item       VARCHAR(250)         NULL,
    created_by      VARCHAR(100)         NULL,
    created_at      DATETIME             NULL,
    updated_by      VARCHAR(100)         NULL,
    updated_at      DATETIME             NULL,
    is_active       TINYINT(1) DEFAULT 1 NULL,
    is_deleted      TINYINT(1) DEFAULT 0 NULL,
    deleted_by      VARCHAR(100)         NULL,
    deleted_at      DATETIME             NULL
);
