-- =========================================
-- V19__create_sos_prod_master_pm_detls_t.sql
-- Oracle SOS_PROD_MASTER_PM_DETLS_T → MySQL
-- Oracle PM_PACKING_DETSL_ID  NUMBER(11)  → BIGINT NOT NULL PK
-- Oracle PRODUCT_ID            NUMBER(11)  → BIGINT
-- Oracle PM_ID                 NUMBER(11)  → BIGINT
-- Oracle ISACTIVE              NUMBER(1)   → is_active TINYINT(1) DEFAULT 1
-- Extra soft-delete and audit columns added for BaseAuditEntity consistency
-- =========================================

CREATE TABLE IF NOT EXISTS sos_prod_master_pm_detls_t (
    pm_packing_detsl_id     BIGINT          NOT NULL,
    product_id              BIGINT,
    pm_id                   BIGINT,
    created_by              VARCHAR(100),
    created_at              DATETIME,
    updated_by              VARCHAR(100),
    updated_at              DATETIME,
    is_active               TINYINT(1)      DEFAULT 1,
    is_deleted              TINYINT(1)      DEFAULT 0,
    deleted_by              VARCHAR(100),
    deleted_at              DATETIME,
    PRIMARY KEY (pm_packing_detsl_id)
    
);