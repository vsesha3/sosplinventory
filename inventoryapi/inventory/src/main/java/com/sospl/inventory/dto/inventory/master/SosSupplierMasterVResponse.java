package com.sospl.inventory.dto.inventory.master;

import java.time.LocalDateTime;

public class SosSupplierMasterVResponse {

    // ── Identity ──────────────────────────────────────────────────────────────
    private Long   supplierId;
    private String supplierCode;
    private String supplierName;

    // ── Contact & Address ─────────────────────────────────────────────────────
    private String address;
    private String eMailId;
    private String contactPerson;
    private String contactMobile;

    // ── Classification ────────────────────────────────────────────────────────
    private Long   countryId;
    private String countryName;
    private Long   supplierTypeId;
    private String supplierTypeName;

    // ── Registration ──────────────────────────────────────────────────────────
    private String gstNo;
    private String panNo;
    private String iTNo;          // I.T. No

    // ── Audit ─────────────────────────────────────────────────────────────────
    private Boolean       isActive;
    private String        createdBy;
    private LocalDateTime createdOn;
    private String        lastUpdatedBy;
    private LocalDateTime lastUpdatedOn;

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

    public String getSupplierCode() { return supplierCode; }
    public void setSupplierCode(String supplierCode) { this.supplierCode = supplierCode; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String geteMailId() { return eMailId; }
    public void seteMailId(String eMailId) { this.eMailId = eMailId; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getContactMobile() { return contactMobile; }
    public void setContactMobile(String contactMobile) { this.contactMobile = contactMobile; }

    public Long getCountryId() { return countryId; }
    public void setCountryId(Long countryId) { this.countryId = countryId; }

    public String getCountryName() { return countryName; }
    public void setCountryName(String countryName) { this.countryName = countryName; }

    public Long getSupplierTypeId() { return supplierTypeId; }
    public void setSupplierTypeId(Long supplierTypeId) { this.supplierTypeId = supplierTypeId; }

    public String getSupplierTypeName() { return supplierTypeName; }
    public void setSupplierTypeName(String supplierTypeName) { this.supplierTypeName = supplierTypeName; }

   

    public String getGstNo() {
		return gstNo;
	}
	public void setGstNo(String gstNo) {
		this.gstNo = gstNo;
	}
	public String getPanNo() { return panNo; }
    public void setPanNo(String panNo) { this.panNo = panNo; }

    public String getiTNo() { return iTNo; }
    public void setiTNo(String iTNo) { this.iTNo = iTNo; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedOn() { return createdOn; }
    public void setCreatedOn(LocalDateTime createdOn) { this.createdOn = createdOn; }

    public String getLastUpdatedBy() { return lastUpdatedBy; }
    public void setLastUpdatedBy(String lastUpdatedBy) { this.lastUpdatedBy = lastUpdatedBy; }

    public LocalDateTime getLastUpdatedOn() { return lastUpdatedOn; }
    public void setLastUpdatedOn(LocalDateTime lastUpdatedOn) { this.lastUpdatedOn = lastUpdatedOn; }
}