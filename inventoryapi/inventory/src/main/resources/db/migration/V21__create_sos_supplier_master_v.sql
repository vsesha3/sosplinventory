-- =========================================
-- V21__create_sos_supplier_master_v.sql
-- Oracle SOS_SUPPLIER_MASTER_V → MySQL VIEW
-- Joins: supplier + country + users + supplier_type + type
-- =========================================


CREATE TABLE IF NOT EXISTS sos_country_master_t (
    country_id BIGINT AUTO_INCREMENT,
    country_name VARCHAR(250),
    created_by BIGINT,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_updated_by BIGINT,
    last_updated_on DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isactive TINYINT(1),
    country_code VARCHAR(25),

    CONSTRAINT sos_country_master_t_pk PRIMARY KEY (country_id)
);   


CREATE OR REPLACE VIEW sos_supplier_master_v AS
SELECT 
    s.supplier_id,
    s.supplier_name,
    s.supplier_code,
    s.address,
    COALESCE(c.country_name, '-')           AS country_name,
    COALESCE(u.user_name, '-')              AS created_by,
    s.created_at                            AS created_on,
    COALESCE(u.user_name, '-')              AS last_updated_by,
    s.updated_at                            AS last_updated_on,
    s.is_active,
    COALESCE(tm.type, '-')                  AS type,
    COALESCE(stm.supplier_type_name, '-')   AS supplier_type_name,
    COALESCE(s.e_c_c_no, '-')              AS e_c_c_no,
    COALESCE(s.i_t_no, '-')               AS i_t_no,
    COALESCE(s.r_c_no, '-')               AS r_c_no,
    COALESCE(s.c_s_t_no, '-')             AS c_s_t_no,
    COALESCE(s.l_s_t_no, '-')             AS l_s_t_no,
    COALESCE(s.ser_tax_reg_no, '-')        AS ser_tax_reg_no,
    COALESCE(s.ser_tax_certificate_no, '-') AS ser_tax_certificate_no,
    COALESCE(s.ser_tax_classification_no, '-') AS ser_tax_classification_no,
    COALESCE(s.range_no, '-')              AS range_no,
    COALESCE(s.range_address, '-')         AS range_address,
    COALESCE(s.division_no, '-')           AS division_no,
    COALESCE(s.division_address, '-')      AS division_address,
    COALESCE(s.commissionerate, 0)         AS commissionerate,
    COALESCE(s.cheq_favr, '-')            AS cheq_favr,
    COALESCE(s.phone_no, '-')             AS phone_no,
    COALESCE(s.e_mailid, '-')             AS e_mailid,
    COALESCE(s.contact_person, '-')        AS contact_person,
    COALESCE(s.contact_mobile, '-')        AS contact_mobile
FROM sos_supplier_master_t s
LEFT JOIN sos_country_master_t c 
    ON s.country_id = c.country_id
LEFT JOIN srr_users_t u 
    ON s.created_by = u.user_id
LEFT JOIN sos_supplier_type_master_t stm 
    ON stm.supplier_type_id = s.supplier_type_id
LEFT JOIN sos_type_master_t tm 
    ON tm.type_id = s.type_id;
    
 