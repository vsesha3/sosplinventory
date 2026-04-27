-- ── Main table — RM Issue header ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sos_rm_issue_t
(
    rm_issue_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_date      DATE                 NULL,
    issue_shift     VARCHAR(50)          NULL,
    issue_time      TIME                 NULL,
    rm_req_detls_id BIGINT               NULL,
    received_by     VARCHAR(100)         NULL,
    issue_by        VARCHAR(100)         NULL,
    rm_req_id       BIGINT               NULL,
    created_by      VARCHAR(100)         NULL,
    created_at      DATETIME             NULL,
    updated_by      VARCHAR(100)         NULL,
    updated_at      DATETIME             NULL,
    is_active       TINYINT(1) DEFAULT 1 NULL,
    is_deleted      TINYINT(1) DEFAULT 0 NULL,
    deleted_by      VARCHAR(100)         NULL,
    deleted_at      DATETIME             NULL
);

-- ── Detail table — RM Issue line items ───────────────────────────────────
CREATE TABLE IF NOT EXISTS sos_rm_issue_details_t
(
    rm_issue_details_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rm_issue_id         BIGINT               NULL,
    issue_qty           DECIMAL(11, 2)       NULL,
    rm_receipt_id       BIGINT               NULL,
    rm_req_detls_id     BIGINT               NULL,
    remark              VARCHAR(500)         NULL,
    created_by          VARCHAR(100)         NULL,
    created_at          DATETIME             NULL,
    updated_by          VARCHAR(100)         NULL,
    updated_at          DATETIME             NULL,
    is_active           TINYINT(1) DEFAULT 1 NULL,
    is_deleted          TINYINT(1) DEFAULT 0 NULL,
    deleted_by          VARCHAR(100)         NULL,
    deleted_at          DATETIME             NULL
);