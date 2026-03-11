-- =========================================
-- V18__create_test_master_table.sql
-- Oracle SOS_TEST_MASTER_T → MySQL
-- Oracle TEST_ID       NUMBER(11)     → BIGINT NOT NULL PK
-- Oracle TEST_CODE     VARCHAR2(25)   → VARCHAR(25)
-- Oracle TEST_NAME     VARCHAR2(50)   → VARCHAR(50)
-- Oracle ISACTIVE      NUMBER(1) DEFAULT 1 → is_active TINYINT(1) DEFAULT 1
-- Oracle CREATED_BY    NUMBER(11)     → created_by VARCHAR(100)
-- Oracle CREATED_ON    DATE           → created_at DATETIME
-- Oracle LAST_UPDATED_BY NUMBER(11)   → updated_by VARCHAR(100)
-- Oracle LAST_UPDATED_ON DATE         → updated_at DATETIME
-- FK to SRR_USERS_T removed (audit cols stored as VARCHAR per BaseAuditEntity)
-- Extra soft-delete columns added for app layer consistency
-- =========================================

CREATE TABLE IF NOT EXISTS sos_test_master_t (
    test_id             BIGINT          NOT NULL,
    test_code           VARCHAR(25),
    test_name           VARCHAR(50),
    created_by          VARCHAR(100),
    created_at          DATETIME,
    updated_by          VARCHAR(100),
    updated_at          DATETIME,
    is_active           TINYINT(1)      DEFAULT 1,
    is_deleted          TINYINT(1)      DEFAULT 0,
    deleted_by          VARCHAR(100),
    deleted_at          DATETIME,
    PRIMARY KEY (test_id)
);

-- =========================================
-- Drop tables in reverse FK order
-- =========================================
DROP TABLE IF EXISTS sos_po_details_t;
DROP TABLE IF EXISTS sos_po_header_t;
DROP TABLE IF EXISTS sos_purchase_order_t;


-- =========================================
-- sos_purchase_order_t
-- =========================================
CREATE TABLE IF NOT EXISTS sos_purchase_order_t (
    po_id               BIGINT          NOT NULL,
    po_number           VARCHAR(25),
    company_id          BIGINT,
    ord_date            DATETIME,
    ord_delivery_date   DATETIME,
    partial_po_flag     TINYINT(1)      DEFAULT 0,
    created_by          VARCHAR(100),
    created_at          DATETIME,
    updated_by          VARCHAR(100),
    updated_at          DATETIME,
    is_active           TINYINT(1)      DEFAULT 1,
    is_deleted          TINYINT(1)      DEFAULT 0,
    deleted_by          VARCHAR(100),
    deleted_at          DATETIME,
    PRIMARY KEY (po_id)
);


-- =========================================
-- sos_po_header_t
-- =========================================
CREATE TABLE IF NOT EXISTS sos_po_header_t (
    po_ref_no               BIGINT          NOT NULL,
    po_no                   VARCHAR(50),
    po_date                 DATETIME,
    po_kind_attention       VARCHAR(50),
    supplier_id             BIGINT,
    po_delivery_schedule    DATETIME,
    po_payment_terms        VARCHAR(500),
    po_type                 VARCHAR(20),
    po_vat                  DECIMAL(11,2),
    po_cst                  DECIMAL(11,2),
    po_reference            VARCHAR(200),
    po_remarks              VARCHAR(200),
    po_ref_gen_no           BIGINT,
    po_delivery_terms       VARCHAR(100),
    requested_by            BIGINT,
    add_charges             DECIMAL(11,2),
    po_closed_flag          CHAR(1),
    created_by              VARCHAR(100),
    created_at              DATETIME,
    updated_by              VARCHAR(100),
    updated_at              DATETIME,
    is_active               TINYINT(1)      DEFAULT 1,
    is_deleted              TINYINT(1)      DEFAULT 0,
    deleted_by              VARCHAR(100),
    deleted_at              DATETIME,
    PRIMARY KEY (po_ref_no)
);


-- =========================================
-- sos_po_details_t
-- =========================================
CREATE TABLE IF NOT EXISTS sos_po_details_t (
    po_det_id           BIGINT          NOT NULL,
    po_ref_no           BIGINT,
    po_rm_code          VARCHAR(50),
    po_rm_name          VARCHAR(500),
    po_qty              DECIMAL(11,2),
    po_rate             DECIMAL(11,2),
    po_cenvat           DECIMAL(11,2),
    po_no_of_packs      DECIMAL(11,2),
    po_pack_size        DECIMAL(11,2),
    po_uom              VARCHAR(10),
    po_cenvat_rate      DECIMAL(11,2),
    po_cst              DECIMAL(11,2),
    po_vat              DECIMAL(11,2),
    po_service_tax      DECIMAL(11,2),
    igst                DECIMAL(11,2),
    cgst                DECIMAL(11,2),
    sgst                DECIMAL(11,2),
    cgst_value          DECIMAL(11,2),
    sgst_value          DECIMAL(11,2),
    igst_value          DECIMAL(11,2),
    h_s_n_code          VARCHAR(250),
    created_by          VARCHAR(100),
    created_at          DATETIME,
    updated_by          VARCHAR(100),
    updated_at          DATETIME,
    is_active           TINYINT(1)      DEFAULT 1,
    is_deleted          TINYINT(1)      DEFAULT 0,
    deleted_by          VARCHAR(100),
    deleted_at          DATETIME,
    PRIMARY KEY (po_det_id)
);