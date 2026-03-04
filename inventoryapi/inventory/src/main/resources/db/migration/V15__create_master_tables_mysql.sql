-- =========================================
-- V17__create_master_tables_with_audit.sql
-- Exact replica of Oracle schema for MySQL
-- =========================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS sos_transporter_master_t;
DROP TABLE IF EXISTS sos_uom_master_t;
DROP TABLE IF EXISTS sos_rm_group_master_t;
DROP TABLE IF EXISTS sos_qc_test_master_t;
DROP TABLE IF EXISTS sos_area_master_t;
DROP TABLE IF EXISTS sos_brand_master_t;
DROP TABLE IF EXISTS sos_rm_master_t;
DROP TABLE IF EXISTS sos_pm_master_t;
DROP TABLE IF EXISTS sos_product_master_t;
DROP TABLE IF EXISTS sos_customer_master_t;
DROP TABLE IF EXISTS sos_supplier_master_t;
DROP TABLE IF EXISTS sos_capital_goods_master_t;
DROP TABLE IF EXISTS sos_subitem_master_t;
DROP TABLE IF EXISTS sos_misc_master_t;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================
-- AUDIT COLUMN BLOCK (mapped from Oracle)
-- Oracle CREATED_BY  NUMBER(11)  → created_by  VARCHAR(100)
-- Oracle CREATED_ON  DATE        → created_at  DATETIME
-- Oracle LAST_UPDATED_BY NUMBER  → updated_by  VARCHAR(100)
-- Oracle LAST_UPDATED_ON DATE    → updated_at  DATETIME
-- Oracle ISACTIVE NUMBER(1) DEFAULT 1 → is_active TINYINT(1) DEFAULT 1
-- Extra soft-delete columns retained (not in Oracle but kept for app layer)
-- =========================================


-- =========================================
-- TRANSPORTER
-- Oracle: TRANSPORTER_ID NUMBER NOT NULL PK,
--         TRANSPORTER_NAME VARCHAR2(30), audit cols, ISACTIVE NUMBER(1)
-- =========================================
CREATE TABLE sos_transporter_master_t (
    transporter_id      BIGINT          NOT NULL,
    transporter_name    VARCHAR(30),
    created_by          VARCHAR(100),
    created_at          DATETIME,
    updated_by          VARCHAR(100),
    updated_at          DATETIME,
    is_active           TINYINT(1)      DEFAULT 1,
    is_deleted          TINYINT(1)      DEFAULT 0,
    deleted_by          VARCHAR(100),
    deleted_at          DATETIME,
    PRIMARY KEY (transporter_id)
);


-- =========================================
-- UOM
-- Oracle: UOM_ID NUMBER(11) NOT NULL PK,
--         UOM_NAME VARCHAR2(250), audit cols, ISACTIVE NUMBER(1)
-- =========================================
CREATE TABLE sos_uom_master_t (
    uom_id              BIGINT          NOT NULL,
    uom_name            VARCHAR(250),
    created_by          VARCHAR(100),
    created_at          DATETIME,
    updated_by          VARCHAR(100),
    updated_at          DATETIME,
    is_active           TINYINT(1)      DEFAULT 1,
    is_deleted          TINYINT(1)      DEFAULT 0,
    deleted_by          VARCHAR(100),
    deleted_at          DATETIME,
    PRIMARY KEY (uom_id)
);


-- =========================================
-- RM GROUP  (lookup table — no direct Oracle DDL provided, retained as-is)
-- =========================================
CREATE TABLE sos_rm_group_master_t (
    id                  BIGINT          AUTO_INCREMENT PRIMARY KEY,
    rm_group_id         INT             UNIQUE,
    rm_group_name       VARCHAR(30),
    created_by          VARCHAR(100),
    created_at          DATETIME,
    updated_by          VARCHAR(100),
    updated_at          DATETIME,
    is_active           TINYINT(1)      DEFAULT 1,
    is_deleted          TINYINT(1)      DEFAULT 0,
    deleted_by          VARCHAR(100),
    deleted_at          DATETIME
);


-- =========================================
-- QC TEST
-- Oracle: QC_TEST_ID NUMBER(11) NOT NULL PK,
--         QC_TEST_CODE VARCHAR2(25), QC_TEST_NAME VARCHAR2(100),
--         ISACTIVE NUMBER(1) DEFAULT 1, audit cols
-- =========================================
CREATE TABLE sos_qc_test_master_t (
    qc_test_id          BIGINT          NOT NULL,
    qc_test_code        VARCHAR(25),
    qc_test_name        VARCHAR(100),
    created_by          VARCHAR(100),
    created_at          DATETIME,
    updated_by          VARCHAR(100),
    updated_at          DATETIME,
    is_active           TINYINT(1)      DEFAULT 1,
    is_deleted          TINYINT(1)      DEFAULT 0,
    deleted_by          VARCHAR(100),
    deleted_at          DATETIME,
    PRIMARY KEY (qc_test_id)
);


-- =========================================
-- AREA
-- Oracle: AREA_ID NUMBER(11) NOT NULL PK,
--         AREA_NAME VARCHAR2(100),
--         ISACTIVE NUMBER(1) DEFAULT 1, audit cols
-- =========================================
CREATE TABLE sos_area_master_t (
    area_id             BIGINT          NOT NULL,
    area_name           VARCHAR(100),
    created_by          VARCHAR(100),
    created_at          DATETIME,
    updated_by          VARCHAR(100),
    updated_at          DATETIME,
    is_active           TINYINT(1)      DEFAULT 1,
    is_deleted          TINYINT(1)      DEFAULT 0,
    deleted_by          VARCHAR(100),
    deleted_at          DATETIME,
    PRIMARY KEY (area_id)
);


-- =========================================
-- BRAND
-- Oracle: BRAND_ID NUMBER, BRAND_NAME VARCHAR2(200), ACTIVE_FLAG CHAR(1)
-- Note: active_flag mapped to TINYINT(1) to satisfy BaseAuditEntity Boolean mapping
--       Full audit block added for Hibernate schema-validation compatibility
-- =========================================
CREATE TABLE sos_brand_master_t (
    brand_id            BIGINT,
    brand_name          VARCHAR(200),
    active_flag         TINYINT(1)      DEFAULT 1,
    created_by          VARCHAR(100),
    created_at          DATETIME,
    updated_by          VARCHAR(100),
    updated_at          DATETIME,
    is_active           TINYINT(1)      DEFAULT 1,
    is_deleted          TINYINT(1)      DEFAULT 0,
    deleted_by          VARCHAR(100),
    deleted_at          DATETIME
);


-- =========================================
-- RM MASTER
-- Oracle: RM_ID NUMBER(11) NOT NULL PK,
--         RM_CODE NUMBER(11), RM_NAME VARCHAR2(250),
--         UOM_ID NUMBER(11), RM_GROUP_ID NUMBER,
-- Note: Excise cols removed (GST migration — no longer required)
--         TEST_ID NUMBER, PACK_SIZE NUMBER(11), CAPACITY NUMBER(11),
--         PACK_UOM NUMBER(11), H_NH_ID NUMBER(11),
--         ISACTIVE NUMBER(1) DEFAULT 1, audit cols
-- =========================================
CREATE TABLE sos_rm_master_t (
    rm_id               BIGINT          NOT NULL,
    rm_code             BIGINT,
    rm_name             VARCHAR(250),
    uom_id              BIGINT,
    rm_group_id         BIGINT,
    test_id             BIGINT,
    avg_rate            DECIMAL(11,2),
    pack_size           BIGINT,
    capacity            BIGINT,
    pack_uom            BIGINT,
    h_nh_id             BIGINT,
    created_by          VARCHAR(100),
    created_at          DATETIME,
    updated_by          VARCHAR(100),
    updated_at          DATETIME,
    is_active           TINYINT(1)      DEFAULT 1,
    is_deleted          TINYINT(1)      DEFAULT 0,
    deleted_by          VARCHAR(100),
    deleted_at          DATETIME,
    PRIMARY KEY (rm_id)
);


-- =========================================
-- PM MASTER
-- Oracle: PM_ID NUMBER(11) PK, PM_CODE NUMBER(11),
--         PM_NAME VARCHAR2(250), PM_SIZE NUMBER(11),
--         FG_LOT_CODE VARCHAR2(10),
-- Note: Excise cols removed (GST migration — no longer required)
--         PM_GROUP_ID NUMBER(11), TARE_WGT NUMBER(11,2),
--         UOM_ID NUMBER(11), H_NH_ID NUMBER(11),
--         ISACTIVE NUMBER(1) DEFAULT 1, audit cols
-- FIX: Added fg_lot_code VARCHAR(10) and h_nh_id — were missing in old migration
-- =========================================
CREATE TABLE sos_pm_master_t (
    pm_id               BIGINT          NOT NULL,
    pm_code             BIGINT,
    pm_name             VARCHAR(250),
    pm_size             BIGINT,
    fg_lot_code         VARCHAR(10),
    uom_id              BIGINT,
    pm_group_id         BIGINT,
    tare_wgt            DECIMAL(11,2),
    h_nh_id             BIGINT,
    avg_rate            DECIMAL(11,2),
    created_by          VARCHAR(100),
    created_at          DATETIME,
    updated_by          VARCHAR(100),
    updated_at          DATETIME,
    is_active           TINYINT(1)      DEFAULT 1,
    is_deleted          TINYINT(1)      DEFAULT 0,
    deleted_by          VARCHAR(100),
    deleted_at          DATETIME,
    PRIMARY KEY (pm_id)
);


-- =========================================
-- PRODUCT MASTER
-- Oracle: PRODUCT_ID NUMBER(11) NOT NULL PK,
--         PRODUCT_NAME VARCHAR2(250), UOM_ID NUMBER(11),
--         PRODUCT_CODE NUMBER(11), FG_LOT_CODE VARCHAR2(10),
--         PRODUCT_GROUP_ID NUMBER, TEST_ID NUMBER,
-- Note: Excise cols removed (GST migration — no longer required)
--         CONVERSION_COST NUMBER(11,2), CAPACITY NUMBER(11),
--         PACKING_TYPE VARCHAR2(250), PREFIX VARCHAR2(250),
--         BRAND_NAME VARCHAR2(1000), ISACTIVE NUMBER(1), audit cols
--      fg_lot_code corrected from VARCHAR(2) → VARCHAR(10)
-- =========================================
CREATE TABLE sos_product_master_t (
    product_id          BIGINT          NOT NULL,
    product_name        VARCHAR(250),
    product_code        BIGINT,
    uom_id              BIGINT,
    product_group_id    BIGINT,
    test_id             BIGINT,
    fg_lot_code         VARCHAR(10),
    rate                DECIMAL(11,2),
    conversion_cost     DECIMAL(11,2),
    capacity            BIGINT,
    packing_type        VARCHAR(250),
    prefix              VARCHAR(250),
    brand_name          VARCHAR(1000),
    created_by          VARCHAR(100),
    created_at          DATETIME,
    updated_by          VARCHAR(100),
    updated_at          DATETIME,
    is_active           TINYINT(1)      DEFAULT 1,
    is_deleted          TINYINT(1)      DEFAULT 0,
    deleted_by          VARCHAR(100),
    deleted_at          DATETIME,
    PRIMARY KEY (product_id)
);


-- =========================================
-- CUSTOMER MASTER
-- Oracle: CUSTOMER_ID NUMBER(11) NOT NULL PK,
--         CUSTOMER_NAME VARCHAR2(250), ADDRESS VARCHAR2(250),
--         COUNTRY_ID NUMBER(11), LOCATION VARCHAR2(250),
--         CUSTOMER_CODE VARCHAR2(250), TYPE_ID NUMBER(1),
--         DELIVERY_ADDRESS VARCHAR2(250),
--         E_C_C_NO, I_T_NO, R_C_NO, C_S_T_NO, L_S_T_NO VARCHAR2(250),
--         RANGE_NO VARCHAR2(25), RANGE_ADDRESS VARCHAR2(250),
--         DIVISION_NO VARCHAR2(25), DIVISION_ADDRESS VARCHAR2(250),
--         BOND_VALE NUMBER(11,2), PHONE_NO VARCHAR2(25),
--         E_MAILID VARCHAR2(25), CONTACT_PERSON VARCHAR2(250),
--         CONTACT_MOBILE VARCHAR2(250),
--         SER_TAX_REG_NO, SER_TAX_CERTIFICATE_NO,
--         SER_TAX_CLASSIFICATION_NO VARCHAR2(250),
--         COMMISSIONERATE VARCHAR2(100), G_S_T_NO VARCHAR2(250),
--         ISACTIVE NUMBER(1), audit cols
-- FIX: Many columns were missing — country_id, location, customer_code,
--      type_id, delivery_address, all tax/range/division cols added
-- =========================================
CREATE TABLE sos_customer_master_t (
    customer_id                 BIGINT          NOT NULL,
    customer_name               VARCHAR(250),
    address                     VARCHAR(250),
    country_id                  BIGINT,
    location                    VARCHAR(250),
    customer_code               VARCHAR(250),
    type_id                     TINYINT(1),
    delivery_address            VARCHAR(250),
    e_c_c_no                    VARCHAR(250),
    i_t_no                      VARCHAR(250),
    r_c_no                      VARCHAR(250),
    c_s_t_no                    VARCHAR(250),
    l_s_t_no                    VARCHAR(250),
    range_no                    VARCHAR(25),
    range_address               VARCHAR(250),
    division_no                 VARCHAR(25),
    division_address            VARCHAR(250),
    bond_vale                   DECIMAL(11,2),
    phone_no                    VARCHAR(25),
    e_mailid                    VARCHAR(25),
    contact_person              VARCHAR(250),
    contact_mobile              VARCHAR(250),
    ser_tax_reg_no              VARCHAR(250),
    ser_tax_certificate_no      VARCHAR(250),
    ser_tax_classification_no   VARCHAR(250),
    commissionerate             VARCHAR(100),
    g_s_t_no                    VARCHAR(250),
    created_by                  VARCHAR(100),
    created_at                  DATETIME,
    updated_by                  VARCHAR(100),
    updated_at                  DATETIME,
    is_active                   TINYINT(1)      DEFAULT 1,
    is_deleted                  TINYINT(1)      DEFAULT 0,
    deleted_by                  VARCHAR(100),
    deleted_at                  DATETIME,
    PRIMARY KEY (customer_id)
);


-- =========================================
-- SUPPLIER MASTER
-- Oracle: SUPPLIER_ID NUMBER(11) NOT NULL PK,
--         SUPPLIER_NAME VARCHAR2(250), ADDRESS VARCHAR2(250),
--         COUNTRY_ID NUMBER(11), SUPPLIER_CODE VARCHAR2(10),
--         TYPE_ID NUMBER(1), SUPPLIER_TYPE_ID NUMBER(1),
--         E_C_C_NO VARCHAR2(25), I_T_NO VARCHAR2(25),
--         R_C_NO, C_S_T_NO, L_S_T_NO VARCHAR2(25),
--         RANGE_NO VARCHAR2(25), RANGE_ADDRESS VARCHAR2(250),
--         DIVISION_NO VARCHAR2(25), DIVISION_ADDRESS VARCHAR2(250),
--         COMMISSIONERATE NUMBER(11), CHEQ_FAVR VARCHAR2(50),
--         PHONE_NO VARCHAR2(25), E_MAILID VARCHAR2(25),
--         CONTACT_PERSON VARCHAR2(250), CONTACT_MOBILE VARCHAR2(250),
--         SER_TAX_REG_NO, SER_TAX_CERTIFICATE_NO,
--         SER_TAX_CLASSIFICATION_NO VARCHAR2(25),
--         ISACTIVE NUMBER(1) DEFAULT 1, audit cols
-- FIX: All tax/registration/range/division/contact cols were missing
-- =========================================
CREATE TABLE sos_supplier_master_t (
    supplier_id                 BIGINT          NOT NULL,
    supplier_name               VARCHAR(250),
    address                     VARCHAR(250),
    country_id                  BIGINT,
    supplier_code               VARCHAR(10),
    type_id                     TINYINT(1),
    supplier_type_id            TINYINT(1),
    e_c_c_no                    VARCHAR(25),
    i_t_no                      VARCHAR(25),
    r_c_no                      VARCHAR(25),
    c_s_t_no                    VARCHAR(25),
    l_s_t_no                    VARCHAR(25),
    range_no                    VARCHAR(25),
    range_address               VARCHAR(250),
    division_no                 VARCHAR(25),
    division_address            VARCHAR(250),
    commissionerate             BIGINT,
    cheq_favr                   VARCHAR(50),
    phone_no                    VARCHAR(25),
    e_mailid                    VARCHAR(25),
    contact_person              VARCHAR(250),
    contact_mobile              VARCHAR(250),
    ser_tax_reg_no              VARCHAR(25),
    ser_tax_certificate_no      VARCHAR(25),
    ser_tax_classification_no   VARCHAR(25),
    created_by                  VARCHAR(100),
    created_at                  DATETIME,
    updated_by                  VARCHAR(100),
    updated_at                  DATETIME,
    is_active                   TINYINT(1)      DEFAULT 1,
    is_deleted                  TINYINT(1)      DEFAULT 0,
    deleted_by                  VARCHAR(100),
    deleted_at                  DATETIME,
    PRIMARY KEY (supplier_id)
);


-- =========================================
-- CAPITAL GOODS
-- Oracle: CG_ID NUMBER(11) NOT NULL PK,
--         CG_CODE VARCHAR2(25), CG_NAME VARCHAR2(100),
-- Note: Excise cols removed (GST migration — no longer required)
--         AVG_RATE NUMBER(11,2), ISACTIVE NUMBER(1) DEFAULT 1, audit cols
-- =========================================
CREATE TABLE sos_capital_goods_master_t (
    cg_id               BIGINT          NOT NULL,
    cg_code             VARCHAR(25),
    cg_name             VARCHAR(100),
    uom_id              BIGINT,
    avg_rate            DECIMAL(11,2),
    created_by          VARCHAR(100),
    created_at          DATETIME,
    updated_by          VARCHAR(100),
    updated_at          DATETIME,
    is_active           TINYINT(1)      DEFAULT 1,
    is_deleted          TINYINT(1)      DEFAULT 0,
    deleted_by          VARCHAR(100),
    deleted_at          DATETIME,
    PRIMARY KEY (cg_id)
);


-- =========================================
-- SUBITEM MASTER
-- Oracle: SUBITEM_ID NUMBER(11) PK,
--         SUBITEM_CODE VARCHAR2(250), SUBITEM_NAME VARCHAR2(250),
--         UOM_ID NUMBER(11), ISACTIVE NUMBER(1) DEFAULT 1, audit cols
-- =========================================
CREATE TABLE sos_subitem_master_t (
    subitem_id          BIGINT          NOT NULL,
    subitem_code        VARCHAR(250),
    subitem_name        VARCHAR(250),
    avg_rate            DECIMAL(11,2),
    uom_id              BIGINT,
    created_by          VARCHAR(100),
    created_at          DATETIME,
    updated_by          VARCHAR(100),
    updated_at          DATETIME,
    is_active           TINYINT(1)      DEFAULT 1,
    is_deleted          TINYINT(1)      DEFAULT 0,
    deleted_by          VARCHAR(100),
    deleted_at          DATETIME,
    PRIMARY KEY (subitem_id)
);


-- =========================================
-- MISC MASTER
-- Oracle: MISC_ID NUMBER PK,
--         MISC_CODE VARCHAR2(50) NOT NULL, MISC_NAME VARCHAR2(100) NOT NULL,
-- Note: Excise cols removed (GST migration — no longer required)
--         UOM_ID NUMBER NOT NULL, audit cols
--      uom_id NOT NULL; is_active aligned to TINYINT(1) DEFAULT 1 per BaseAuditEntity
-- =========================================
CREATE TABLE sos_misc_master_t (
    misc_id                     BIGINT          NOT NULL,
    misc_code                   VARCHAR(50)     NOT NULL,
    misc_name                   VARCHAR(100)    NOT NULL,
    avg_rate                    DECIMAL(11,2),
    uom_id                      BIGINT          NOT NULL,
    created_by                  VARCHAR(100),
    created_at                  DATETIME,
    updated_by                  VARCHAR(100),
    updated_at                  DATETIME,
    is_active                   TINYINT(1)      DEFAULT 1,
    is_deleted                  TINYINT(1)      DEFAULT 0,
    deleted_by                  VARCHAR(100),
    deleted_at                  DATETIME,
    PRIMARY KEY (misc_id)
);
