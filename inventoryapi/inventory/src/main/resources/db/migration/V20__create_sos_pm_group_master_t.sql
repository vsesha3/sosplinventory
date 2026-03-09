-- =========================================
-- V20__create_sos_pm_group_master_t.sql
-- Oracle SOS_PM_GROUP_MASTER_T → MySQL
-- Oracle PM_GROUP_ID    NUMBER(11)     → BIGINT NOT NULL PK
-- Oracle PM_GROUP_NAME  VARCHAR2(30)   → VARCHAR(30)
-- Oracle CH_HEAD_NO     NUMBER(11)     → BIGINT
-- Oracle ISACTIVE       NUMBER(1)      → is_active TINYINT(1) DEFAULT 1
-- Oracle CREATED_BY     NUMBER(11)     → created_by VARCHAR(100)
-- Oracle CREATED_ON     DATE           → created_at DATETIME
-- Oracle LAST_UPDATED_BY NUMBER(11)    → updated_by VARCHAR(100)
-- Oracle LAST_UPDATED_ON DATE          → updated_at DATETIME
-- Extra soft-delete columns added for BaseAuditEntity consistency
-- =========================================

CREATE TABLE IF NOT EXISTS sos_pm_group_master_t (
    pm_group_id             BIGINT          NOT NULL,
    pm_group_name           VARCHAR(30),
    ch_head_no              BIGINT,
    created_by              VARCHAR(100),
    created_at              DATETIME,
    updated_by              VARCHAR(100),
    updated_at              DATETIME,
    is_active               TINYINT(1)      DEFAULT 1,
    is_deleted              TINYINT(1)      DEFAULT 0,
    deleted_by              VARCHAR(100),
    deleted_at              DATETIME,
    PRIMARY KEY (pm_group_id)
);