package com.sospl.inventory.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import com.sospl.inventory.model.common.BaseAuditEntity;

import java.math.BigDecimal;

@Entity
@Table(name = "sos_po_header_t")
public class SosPoHeader extends BaseAuditEntity {

    @Id
    @Column(name = "po_ref_no")
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long poRefNo;

    @Column(name = "po_no", length = 50)
    private String poNo;

    @Column(name = "po_date")
    private java.time.LocalDateTime poDate;

    @Column(name = "po_kind_attention", length = 50)
    private String poKindAttention;

    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(name = "po_delivery_schedule")
    private java.time.LocalDateTime poDeliverySchedule;

    @Column(name = "po_payment_terms", length = 500)
    private String poPaymentTerms;

    @Column(name = "po_type", length = 20)
    private String poType;

    @Column(name = "po_vat", precision = 11, scale = 2)
    private BigDecimal poVat;

    @Column(name = "po_cst", precision = 11, scale = 2)
    private BigDecimal poCst;

    @Column(name = "po_reference", length = 200)
    private String poReference;

    @Column(name = "po_remarks", length = 200)
    private String poRemarks;

    @Column(name = "po_ref_gen_no")
    private Long poRefGenNo;

    @Column(name = "po_delivery_terms", length = 100)
    private String poDeliveryTerms;

    @Column(name = "requested_by")
    private String requestedBy;

    @Column(name = "add_charges", precision = 11, scale = 2)
    private BigDecimal addCharges;

    @Column(name = "po_closed_flag")
    private String poClosedFlag;
    
    @Column(name="freight")
    private String freight;
    
    @Column(name="freight_gst")
    private String freightGst;

   
	public Long getPoRefNo() { return poRefNo; }
    public void setPoRefNo(Long poRefNo) { this.poRefNo = poRefNo; }

    public String getPoNo() { return poNo; }
    public void setPoNo(String poNo) { this.poNo = poNo; }

    public java.time.LocalDateTime getPoDate() { return poDate; }
    public void setPoDate(java.time.LocalDateTime poDate) { this.poDate = poDate; }

    public String getPoKindAttention() { return poKindAttention; }
    public void setPoKindAttention(String poKindAttention) { this.poKindAttention = poKindAttention; }

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

    public java.time.LocalDateTime getPoDeliverySchedule() { return poDeliverySchedule; }
    public void setPoDeliverySchedule(java.time.LocalDateTime poDeliverySchedule) { this.poDeliverySchedule = poDeliverySchedule; }

    public String getPoPaymentTerms() { return poPaymentTerms; }
    public void setPoPaymentTerms(String poPaymentTerms) { this.poPaymentTerms = poPaymentTerms; }

    public String getPoType() { return poType; }
    public void setPoType(String poType) { this.poType = poType; }

    public BigDecimal getPoVat() { return poVat; }
    public void setPoVat(BigDecimal poVat) { this.poVat = poVat; }

    public BigDecimal getPoCst() { return poCst; }
    public void setPoCst(BigDecimal poCst) { this.poCst = poCst; }

    public String getPoReference() { return poReference; }
    public void setPoReference(String poReference) { this.poReference = poReference; }

    public String getPoRemarks() { return poRemarks; }
    public void setPoRemarks(String poRemarks) { this.poRemarks = poRemarks; }

    public Long getPoRefGenNo() { return poRefGenNo; }
    public void setPoRefGenNo(Long poRefGenNo) { this.poRefGenNo = poRefGenNo; }

    public String getPoDeliveryTerms() { return poDeliveryTerms; }
    public void setPoDeliveryTerms(String poDeliveryTerms) { this.poDeliveryTerms = poDeliveryTerms; }

    public String getRequestedBy() { return requestedBy; }
    public void setRequestedBy(String requestedBy) { this.requestedBy = requestedBy; }

    public BigDecimal getAddCharges() { return addCharges; }
    public void setAddCharges(BigDecimal addCharges) { this.addCharges = addCharges; }

    public String getPoClosedFlag() { return poClosedFlag; }
    public void setPoClosedFlag(String poClosedFlag) { this.poClosedFlag = poClosedFlag; }
    
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
}