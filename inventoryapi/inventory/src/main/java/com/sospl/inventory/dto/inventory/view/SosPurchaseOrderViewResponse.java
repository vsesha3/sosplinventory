package com.sospl.inventory.dto.inventory.view;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SosPurchaseOrderViewResponse {

    private Long poRefNo;
    private String poNo;
    private LocalDateTime poDate;
    private String poKindAttention;
    private Long supplierId;
    private String supplierCode;
    private String supplierName;
    private LocalDateTime poDeliverySchedule;
    private String poPaymentTerms;
    private String poDeliveryTerms;
    private String poType;
    private String poReference;
    private String poRemarks;
    private BigDecimal poVat;
    private BigDecimal poCst;
    private Long poRefGenNo;
    private String  requestedBy;
    private BigDecimal addCharges;
    private String poClosedFlag;
    private Boolean isActive;
    private String createdBy;
    private LocalDateTime createdAt;
    private String updatedBy;
    private LocalDateTime updatedAt;
    private String freight;
    private String freightGst;
   

    public String getFreight() {
		return freight;
	}
	public void setFreight(String freight) {
		this.freight = freight;
	}
	public String getFreightGst() {
		return freightGst;
	}
	public void setFreightGst(String freightGst) {
		this.freightGst = freightGst;
	}
	public Long getPoRefNo() { return poRefNo; }
    public void setPoRefNo(Long poRefNo) { this.poRefNo = poRefNo; }

    public String getPoNo() { return poNo; }
    public void setPoNo(String poNo) { this.poNo = poNo; }

    public LocalDateTime getPoDate() { return poDate; }
    public void setPoDate(LocalDateTime poDate) { this.poDate = poDate; }

    public String getPoKindAttention() { return poKindAttention; }
    public void setPoKindAttention(String poKindAttention) { this.poKindAttention = poKindAttention; }

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

    public String getSupplierCode() { return supplierCode; }
    public void setSupplierCode(String supplierCode) { this.supplierCode = supplierCode; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public LocalDateTime getPoDeliverySchedule() { return poDeliverySchedule; }
    public void setPoDeliverySchedule(LocalDateTime poDeliverySchedule) { this.poDeliverySchedule = poDeliverySchedule; }

    public String getPoPaymentTerms() { return poPaymentTerms; }
    public void setPoPaymentTerms(String poPaymentTerms) { this.poPaymentTerms = poPaymentTerms; }

    public String getPoDeliveryTerms() { return poDeliveryTerms; }
    public void setPoDeliveryTerms(String poDeliveryTerms) { this.poDeliveryTerms = poDeliveryTerms; }

    public String getPoType() { return poType; }
    public void setPoType(String poType) { this.poType = poType; }

    public String getPoReference() { return poReference; }
    public void setPoReference(String poReference) { this.poReference = poReference; }

    public String getPoRemarks() { return poRemarks; }
    public void setPoRemarks(String poRemarks) { this.poRemarks = poRemarks; }

    public BigDecimal getPoVat() { return poVat; }
    public void setPoVat(BigDecimal poVat) { this.poVat = poVat; }

    public BigDecimal getPoCst() { return poCst; }
    public void setPoCst(BigDecimal poCst) { this.poCst = poCst; }

    public Long getPoRefGenNo() { return poRefGenNo; }
    public void setPoRefGenNo(Long poRefGenNo) { this.poRefGenNo = poRefGenNo; }

    public String getRequestedBy() { return requestedBy; }
    public void setRequestedBy(String requestedBy) { this.requestedBy = requestedBy; }

    public BigDecimal getAddCharges() { return addCharges; }
    public void setAddCharges(BigDecimal addCharges) { this.addCharges = addCharges; }

    public String getPoClosedFlag() { return poClosedFlag; }
    public void setPoClosedFlag(String poClosedFlag) { this.poClosedFlag = poClosedFlag; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}