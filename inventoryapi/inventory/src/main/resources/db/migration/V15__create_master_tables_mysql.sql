-- =========================================
-- V17__create_master_tables_with_audit.sql
-- Modern Master Tables + Audit Columns
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
-- COMMON AUDIT COLUMN BLOCK
-- =========================================
-- created_by VARCHAR(100)
-- created_at DATETIME
-- updated_by VARCHAR(100)
-- updated_at DATETIME
-- deleted_by VARCHAR(100)
-- deleted_at DATETIME
-- is_active TINYINT(1)
-- is_deleted TINYINT(1)
-- =========================================


-- TRANSPORTER
CREATE TABLE sos_transporter_master_t (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transporter_id INT UNIQUE,
    transporter_name VARCHAR(30),

    created_by VARCHAR(100),
    created_at DATETIME,
    updated_by VARCHAR(100),
    updated_at DATETIME,
    deleted_by VARCHAR(100),
    deleted_at DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    is_deleted TINYINT(1) DEFAULT 0
);


-- UOM
CREATE TABLE sos_uom_master_t (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    uom_id INT UNIQUE,
    uom_name VARCHAR(250),

    created_by VARCHAR(100),
    created_at DATETIME,
    updated_by VARCHAR(100),
    updated_at DATETIME,
    deleted_by VARCHAR(100),
    deleted_at DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    is_deleted TINYINT(1) DEFAULT 0
);


-- RM GROUP
CREATE TABLE sos_rm_group_master_t (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rm_group_id INT UNIQUE,
    rm_group_name VARCHAR(30),

    created_by VARCHAR(100),
    created_at DATETIME,
    updated_by VARCHAR(100),
    updated_at DATETIME,
    deleted_by VARCHAR(100),
    deleted_at DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    is_deleted TINYINT(1) DEFAULT 0
);


-- QC TEST
CREATE TABLE sos_qc_test_master_t (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    qc_test_id INT UNIQUE,
    qc_test_code VARCHAR(25),
    qc_test_name VARCHAR(100),

    created_by VARCHAR(100),
    created_at DATETIME,
    updated_by VARCHAR(100),
    updated_at DATETIME,
    deleted_by VARCHAR(100),
    deleted_at DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    is_deleted TINYINT(1) DEFAULT 0
);


-- AREA
CREATE TABLE sos_area_master_t (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    area_id INT UNIQUE,
    area_name VARCHAR(100),

    created_by VARCHAR(100),
    created_at DATETIME,
    updated_by VARCHAR(100),
    updated_at DATETIME,
    deleted_by VARCHAR(100),
    deleted_at DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    is_deleted TINYINT(1) DEFAULT 0
);


-- BRAND
CREATE TABLE sos_brand_master_t (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    brand_id INT UNIQUE,
    brand_name VARCHAR(200),

    created_by VARCHAR(100),
    created_at DATETIME,
    updated_by VARCHAR(100),
    updated_at DATETIME,
    deleted_by VARCHAR(100),
    deleted_at DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    is_deleted TINYINT(1) DEFAULT 0
);


-- RM MASTER
CREATE TABLE sos_rm_master_t (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rm_id INT UNIQUE,
    rm_code INT,
    rm_name VARCHAR(250),
    uom_id INT,
    rm_group_id INT,
    test_id INT,
    excise_tariff_no INT,
    excise_declared_item TINYINT,
    excise_rate DECIMAL(5,2),
    e_cess_rate DECIMAL(5,2),
    sh_e_cess_rate DECIMAL(5,2),
    avg_rate DECIMAL(11,2),
    pack_size INT,
    capacity INT,
    pack_uom INT,
    h_nh_id INT,

    created_by VARCHAR(100),
    created_at DATETIME,
    updated_by VARCHAR(100),
    updated_at DATETIME,
    deleted_by VARCHAR(100),
    deleted_at DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    is_deleted TINYINT(1) DEFAULT 0
);


-- PM MASTER
CREATE TABLE sos_pm_master_t (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pm_id INT UNIQUE,
    pm_code INT,
    pm_name VARCHAR(250),
    pm_size INT,
    uom_id INT,
    excise_tariff_no INT,
    excise_declared_item TINYINT,
    excise_rate DECIMAL(5,2),
    e_cess_rate DECIMAL(5,2),
    sh_e_cess_rate DECIMAL(5,2),
    avg_rate DECIMAL(11,2),
    pm_group_id INT,
    tare_wgt DECIMAL(11,2),

    created_by VARCHAR(100),
    created_at DATETIME,
    updated_by VARCHAR(100),
    updated_at DATETIME,
    deleted_by VARCHAR(100),
    deleted_at DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    is_deleted TINYINT(1) DEFAULT 0
);


-- PRODUCT MASTER
CREATE TABLE sos_product_master_t (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNIQUE,
    product_name VARCHAR(250),
    uom_id INT,
    product_group_id INT,
    test_id INT,
    rate DECIMAL(11,2),
    conversion_cost DECIMAL(11,2),
    capacity INT,
    packing_type VARCHAR(250),
    prefix VARCHAR(250),
    brand_name VARCHAR(1000),

    created_by VARCHAR(100),
    created_at DATETIME,
    updated_by VARCHAR(100),
    updated_at DATETIME,
    deleted_by VARCHAR(100),
    deleted_at DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    is_deleted TINYINT(1) DEFAULT 0
);


-- CUSTOMER
CREATE TABLE sos_customer_master_t (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNIQUE,
    customer_name VARCHAR(250),
    address VARCHAR(250),
    phone_no VARCHAR(25),
    g_s_t_no VARCHAR(250),

    created_by VARCHAR(100),
    created_at DATETIME,
    updated_by VARCHAR(100),
    updated_at DATETIME,
    deleted_by VARCHAR(100),
    deleted_at DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    is_deleted TINYINT(1) DEFAULT 0
);


-- SUPPLIER
CREATE TABLE sos_supplier_master_t (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT UNIQUE,
    supplier_name VARCHAR(250),
    address VARCHAR(250),
    phone_no VARCHAR(25),

    created_by VARCHAR(100),
    created_at DATETIME,
    updated_by VARCHAR(100),
    updated_at DATETIME,
    deleted_by VARCHAR(100),
    deleted_at DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    is_deleted TINYINT(1) DEFAULT 0
);


-- CAPITAL GOODS
CREATE TABLE sos_capital_goods_master_t (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cg_id INT UNIQUE,
    cg_name VARCHAR(100),
    cg_code VARCHAR(100),
    excise_rate DECIMAL(11,2),
    avg_rate DECIMAL(11,2),
    uom_id INT,
    e_cess_rate DECIMAL(11,2),
   
    created_by VARCHAR(100),
    created_at DATETIME,
    updated_by VARCHAR(100),
    updated_at DATETIME,
    deleted_by VARCHAR(100),
    deleted_at DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    is_deleted TINYINT(1) DEFAULT 0
);


-- SUBITEM
CREATE TABLE sos_subitem_master_t (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subitem_id INT UNIQUE,
    subitem_code VARCHAR(250),
    subitem_name VARCHAR(250),
    excise_rate DECIMAL(5,2),
    avg_rate DECIMAL(11,2),
    uom_id INT,

    created_by VARCHAR(100),
    created_at DATETIME,
    updated_by VARCHAR(100),
    updated_at DATETIME,
    deleted_by VARCHAR(100),
    deleted_at DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    is_deleted TINYINT(1) DEFAULT 0
);


-- MISC
CREATE TABLE sos_misc_master_t (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    misc_id INT UNIQUE,
    misc_code VARCHAR(50),
    misc_name VARCHAR(100),
    excise_rate DECIMAL(11,2),
    avg_rate DECIMAL(11,2),
    uom_id INT,

    created_by VARCHAR(100),
    created_at DATETIME,
    updated_by VARCHAR(100),
    updated_at DATETIME,
    deleted_by VARCHAR(100),
    deleted_at DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    is_deleted TINYINT(1) DEFAULT 0
);