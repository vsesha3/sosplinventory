package com.sospl.inventory.model.inventory.master;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_supplier_master_t")
public class SosSupplierMaster extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id", nullable = false, unique = true)
    private Integer supplierId;

    @Column(name = "supplier_name", length = 250)
    private String supplierName;

    @Column(name = "supplier_code", length = 10)
    private String supplierCode;

    @Column(name = "address", length = 250)
    private String address;

    @Column(name = "country_id")
    private Integer countryId;

    public Integer getSupplierId() {
		return supplierId;
	}

	public void setSupplierId(Integer supplierId) {
		this.supplierId = supplierId;
	}

	public String getSupplierName() {
		return supplierName;
	}

	public void setSupplierName(String supplierName) {
		this.supplierName = supplierName;
	}

	public String getSupplierCode() {
		return supplierCode;
	}

	public void setSupplierCode(String supplierCode) {
		this.supplierCode = "SOSPLS-"+getSupplierId();
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Integer getCountryId() {
		return countryId;
	}

	public void setCountryId(Integer countryId) {
		this.countryId = countryId;
	}

	public Boolean getTypeId() {
		return typeId;
	}

	public void setTypeId(Boolean typeId) {
		this.typeId = typeId;
	}

	public Integer getSupplierTypeId() {
		return supplierTypeId;
	}

	public void setSupplierTypeId(Integer supplierTypeId) {
		this.supplierTypeId = supplierTypeId;
	}

	public String getPhoneNo() {
		return phoneNo;
	}

	public void setPhoneNo(String phoneNo) {
		this.phoneNo = phoneNo;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getGstNo() {
		return gstNo;
	}

	public void setGstNo(String gstNo) {
		this.gstNo = gstNo;
	}

	@Column(name = "type_id")
    private Boolean typeId;

    @Column(name = "supplier_type_id")
    private Integer supplierTypeId;

    @Column(name = "phone_no", length = 25)
    private String phoneNo;

    @Column(name = "e_mailid", length = 25)
    private String emailId;

    @Column(name="gst_no",length=50)
    private String gstNo;
}