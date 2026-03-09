package com.sospl.inventory.model.inventory.master.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

import java.time.LocalDateTime;

@Entity
@Immutable
@Table(name = "sos_supplier_master_v")
public class SosSupplierMasterView {

    @Id
    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(name = "supplier_name")
    private String supplierName;

    @Column(name = "supplier_code")
    private String supplierCode;

    @Column(name = "address")
    private String address;

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

    @Column(name = "type")
    private String type;

    @Column(name = "supplier_type_name")
    private String supplierTypeName;

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
    private Long commissionerate;

    @Column(name = "cheq_favr")
    private String cheqFavr;

    @Column(name = "phone_no")
    private String phoneNo;

    @Column(name = "e_mailid")
    private String eMailId;

    @Column(name = "contact_person")
    private String contactPerson;

    @Column(name = "contact_mobile")
    private String contactMobile;

    public Long getSupplierId() { return supplierId; }
    public String getSupplierName() { return supplierName; }
    public String getSupplierCode() { return supplierCode; }
    public String getAddress() { return address; }
    public String getCountryName() { return countryName; }
    public String getCreatedBy() { return createdBy; }
    public LocalDateTime getCreatedOn() { return createdOn; }
    public String getLastUpdatedBy() { return lastUpdatedBy; }
    public LocalDateTime getLastUpdatedOn() { return lastUpdatedOn; }
    public Boolean getIsActive() { return isActive; }
    public String getType() { return type; }
    public String getSupplierTypeName() { return supplierTypeName; }
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
    public Long getCommissionerate() { return commissionerate; }
    public String getCheqFavr() { return cheqFavr; }
    public String getPhoneNo() { return phoneNo; }
    public String geteMailId() { return eMailId; }
    public String getContactPerson() { return contactPerson; }
    public String getContactMobile() { return contactMobile; }
}