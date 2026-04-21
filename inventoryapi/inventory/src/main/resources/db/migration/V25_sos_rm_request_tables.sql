-- ── Main table — RM Request header ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS sos_rm_request_t
(
    rm_req_id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    rm_req_date           DATETIME             NULL,
    wo_id                 BIGINT               NULL,
    request_by            VARCHAR(100)         NULL,
    schedule_date         DATETIME             NULL,
    plan_to_prod_qty      DECIMAL(11, 2)       NULL,
    production_plan_id    BIGINT               NULL,
    production_lot_number VARCHAR(250)         NULL,
    is_rm_issue_completed TINYINT(1) DEFAULT 0 NULL,
    gin_no                VARCHAR(250)         NULL,
    created_by            VARCHAR(100)         NULL,
    created_at            DATETIME             NULL,
    updated_by            VARCHAR(100)         NULL,
    updated_at            DATETIME             NULL,
    is_active             TINYINT(1) DEFAULT 1 NULL,
    is_deleted            TINYINT(1) DEFAULT 0 NULL,
    deleted_by            VARCHAR(100)         NULL,
    deleted_at            DATETIME             NULL
);

-- ── Detail table — RM Request line items ─────────────────────────────────
CREATE TABLE IF NOT EXISTS sos_rm_request_detls_t
(
    rm_req_detls_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    rm_req_id             BIGINT               NULL,
    rm_id                 BIGINT               NULL,
    qty                   DECIMAL(11, 2)       NULL,
    created_by            VARCHAR(100)         NULL,
    created_at            DATETIME             NULL,
    updated_by            VARCHAR(100)         NULL,
    updated_at            DATETIME             NULL,
    is_active             TINYINT(1) DEFAULT 1 NULL,
    is_deleted            TINYINT(1) DEFAULT 0 NULL,
    deleted_by            VARCHAR(100)         NULL,
    deleted_at            DATETIME             NULL
);