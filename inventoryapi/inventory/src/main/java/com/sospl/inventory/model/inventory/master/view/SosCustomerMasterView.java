package com.sospl.inventory.model.inventory.master.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Immutable
@Subselect("""
        SELECT
            cm.customer_id,
            cm.customer_name,
            cm.customer_code,
            CONCAT_WS(', ',
                cm.address,
                NULLIF(cou.country_name, ''),
                NULLIF(cm.phone_no, ''),
                NULLIF(cm.e_mailid, '')
            )                                           AS address,
            cm.country_id,
            COALESCE(cou.country_name, '-')             AS country_name,
            COALESCE(usr.user_name, '-')                AS created_by,
            cm.created_at                               AS created_on,
            COALESCE(cm.updated_by, '-')                AS last_updated_by,
            cm.updated_at                               AS last_updated_on,
            cm.is_active,
            COALESCE(cm.location, '-')                  AS location,
            COALESCE(tm.type, '-')                      AS type,
            COALESCE(cm.delivery_address, '-')          AS delivery_address,
            COALESCE(cm.e_c_c_no, '-')                 AS e_c_c_no,
            COALESCE(cm.i_t_no, '-')                   AS i_t_no,
            COALESCE(cm.r_c_no, '-')                   AS r_c_no,
            COALESCE(cm.c_s_t_no, '-')                 AS c_s_t_no,
            COALESCE(cm.l_s_t_no, '-')                 AS l_s_t_no,
            COALESCE(cm.ser_tax_reg_no, '-')            AS ser_tax_reg_no,
            COALESCE(cm.ser_tax_certificate_no, '-')    AS ser_tax_certificate_no,
            COALESCE(cm.ser_tax_classification_no, '-') AS ser_tax_classification_no,
            COALESCE(cm.range_no, '-')                  AS range_no,
            COALESCE(cm.range_address, '-')             AS range_address,
            COALESCE(cm.division_no, '-')               AS division_no,
            COALESCE(cm.division_address, '-')          AS division_address,
            COALESCE(cm.commissionerate, '')             AS commissionerate,
            COALESCE(cm.bond_vale, 0)                   AS bond_vale,
            COALESCE(cm.phone_no, '-')                  AS phone_no,
            COALESCE(cm.e_mailid, '-')                  AS e_mailid,
            COALESCE(cm.contact_person, '-')            AS contact_person,
            COALESCE(cm.contact_mobile, '-')            AS contact_mobile
        FROM sos_customer_master_t cm
        LEFT JOIN sos_country_master_t cou
            ON cm.country_id = cou.country_id
        LEFT JOIN srr_users_t usr
            ON cm.created_by = usr.user_name
        LEFT JOIN sos_type_master_t tm
            ON tm.type_id = cm.type_id
        """)
public class SosCustomerMasterView {

    @Id
    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_code")
    private String customerCode;

    @Column(name = "address")
    private String address;

    @Column(name = "country_id")
    private Long countryId;

    @Column(name = "country_name")
    private String countryName;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_on")
    private LocalDateTime createdOn;

    @Column(name = "last_updated_by")
    private String lastUpdatedBy;

    @Column(name = "last_updated_on")
    private LocalDateTime lastUpdatedOn;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "location")
    private String location;

    @Column(name = "type")
    private String type;

    @Column(name = "delivery_address")
    private String deliveryAddress;

    @Column(name = "e_c_c_no")
    private String eCCNo;

    @Column(name = "i_t_no")
    private String iTNo;

    @Column(name = "r_c_no")
    private String rCNo;

    @Column(name = "c_s_t_no")
    private String cSTNo;

    @Column(name = "l_s_t_no")
    private String lSTNo;

    @Column(name = "ser_tax_reg_no")
    private String serTaxRegNo;

    @Column(name = "ser_tax_certificate_no")
    private String serTaxCertificateNo;

    @Column(name = "ser_tax_classification_no")
    private String serTaxClassificationNo;

    @Column(name = "range_no")
    private String rangeNo;

    @Column(name = "range_address")
    private String rangeAddress;

    @Column(name = "division_no")
    private String divisionNo;

    @Column(name = "division_address")
    private String divisionAddress;

    @Column(name = "commissionerate")
    private String commissionerate;

    @Column(name = "bond_vale")
    private BigDecimal bondVale;

    @Column(name = "phone_no")
    private String phoneNo;

    @Column(name = "e_mailid")
    private String eMailId;

    @Column(name = "contact_person")
    private String contactPerson;

    @Column(name = "contact_mobile")
    private String contactMobile;

    public Long getCustomerId() { return customerId; }
    public String getCustomerName() { return customerName; }
    public String getCustomerCode() { return customerCode; }
    public String getAddress() { return address; }
    public Long getCountryId() { return countryId; }
    public String getCountryName() { return countryName; }
    public String getCreatedBy() { return createdBy; }
    public LocalDateTime getCreatedOn() { return createdOn; }
    public String getLastUpdatedBy() { return lastUpdatedBy; }
    public LocalDateTime getLastUpdatedOn() { return lastUpdatedOn; }
    public Boolean getIsActive() { return isActive; }
    public String getLocation() { return location; }
    public String getType() { return type; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public String geteCCNo() { return eCCNo; }
    public String getiTNo() { return iTNo; }
    public String getrCNo() { return rCNo; }
    public String getcSTNo() { return cSTNo; }
    public String getlSTNo() { return lSTNo; }
    public String getSerTaxRegNo() { return serTaxRegNo; }
    public String getSerTaxCertificateNo() { return serTaxCertificateNo; }
    public String getSerTaxClassificationNo() { return serTaxClassificationNo; }
    public String getRangeNo() { return rangeNo; }
    public String getRangeAddress() { return rangeAddress; }
    public String getDivisionNo() { return divisionNo; }
    public String getDivisionAddress() { return divisionAddress; }
    public String getCommissionerate() { return commissionerate; }
    public BigDecimal getBondVale() { return bondVale; }
    public String getPhoneNo() { return phoneNo; }
    public String geteMailId() { return eMailId; }
    public String getContactPerson() { return contactPerson; }
    public String getContactMobile() { return contactMobile; }
}