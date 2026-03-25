CREATE TABLE  IF NOT EXISTS sos_po_receipt_t
(
    po_receipt_no   BIGINT AUTO_INCREMENT
        PRIMARY KEY,
    po_no           BIGINT              NOT NULL,
    po_date         DATE                NOT NULL,
    rm_code         VARCHAR(100)        NOT NULL,
    rm_ord_qty      DECIMAL(11, 2)      NOT NULL,
    rm_received_qty DECIMAL(11, 2)      NOT NULL,
    exp_date_del    DATE                NULL,
    act_date_del    DATE                NULL,
    inspected_by    VARCHAR(100)        NULL,
    approved_by     VARCHAR(100)        NULL,
    invoice_no      VARCHAR(50)         NULL,
    po_det_id       BIGINT              NULL,
    created_by      VARCHAR(100)        NULL,
    created_at      DATETIME            NULL,
    updated_by      VARCHAR(100)        NULL,
    updated_at      DATETIME            NULL,
    is_active       TINYINT(1) DEFAULT 1 NULL,
    is_deleted      TINYINT(1) DEFAULT 0 NULL,
    deleted_by      VARCHAR(100)        NULL,
    deleted_at      DATETIME            NULL
);