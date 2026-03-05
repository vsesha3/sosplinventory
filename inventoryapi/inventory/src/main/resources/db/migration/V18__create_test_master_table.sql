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

CREATE TABLE sos_test_master_t (
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
