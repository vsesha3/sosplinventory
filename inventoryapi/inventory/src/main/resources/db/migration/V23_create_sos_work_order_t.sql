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


CREATE TABLE IF NOT EXISTS sos_production_plan_t
(
    production_plan_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    production_from_date  DATETIME             NULL,
    production_from_shift VARCHAR(50)          NULL,
    production_to_date    DATETIME             NULL,
    production_to_shift   VARCHAR(50)          NULL,
    wo_id                 BIGINT               NULL,
    qty                   DECIMAL(11, 2)       NULL,
    vessel_id             BIGINT               NULL,
    coa_reference         VARCHAR(250)         NULL,
    created_by            VARCHAR(100)         NULL,
    created_at            DATETIME             NULL,
    updated_by            VARCHAR(100)         NULL,
    updated_at            DATETIME             NULL,
    is_active             TINYINT(1) DEFAULT 1 NULL,
    is_deleted            TINYINT(1) DEFAULT 0 NULL,
    deleted_by            VARCHAR(100)         NULL,
    deleted_at            DATETIME             NULL
);

CREATE TABLE IF NOT EXISTS sos_company_master_t
(
    company_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_name    VARCHAR(250)         NULL,
    company_code    VARCHAR(25)          NULL,
    created_by      VARCHAR(100)         NULL,
    created_at      DATETIME             NULL,
    updated_by      VARCHAR(100)         NULL,
    updated_at      DATETIME             NULL,
    is_active       TINYINT(1) DEFAULT 1 NULL,
    is_deleted      TINYINT(1) DEFAULT 0 NULL,
    deleted_by      VARCHAR(100)         NULL,
    deleted_at      DATETIME             NULL
);

CREATE TABLE IF NOT EXISTS sos_vessel_master_t
(
    vessel_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    vessel_name     VARCHAR(250)         NULL,
    created_by      VARCHAR(100)         NULL,
    created_at      DATETIME             NULL,
    updated_by      VARCHAR(100)         NULL,
    updated_at      DATETIME             NULL,
    is_active       TINYINT(1) DEFAULT 1 NULL,
    is_deleted      TINYINT(1) DEFAULT 0 NULL,
    deleted_by      VARCHAR(100)         NULL,
    deleted_at      DATETIME             NULL
);