package com.sospl.inventory.model.inventory.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import java.time.LocalDateTime;

@Entity
@Immutable
@Subselect("""
        SELECT
            pht.po_ref_no,
            pht.po_no,
            pht.po_date,
            pht.po_kind_attention,
            pht.supplier_id,
            COALESCE(smt.supplier_code, '-')        AS supplier_code,
            COALESCE(smt.supplier_name, '-')        AS supplier_name,
            pht.po_delivery_schedule,
            COALESCE(pht.po_payment_terms, '-')     AS po_payment_terms,
            COALESCE(pht.po_delivery_terms, '-')    AS po_delivery_terms,
            COALESCE(pht.po_type, '-')              AS po_type,
            COALESCE(pht.po_reference, '-')         AS po_reference,
            COALESCE(pht.po_remarks, '-')           AS po_remarks,
            pht.po_vat,
            pht.po_cst,
            pht.po_ref_gen_no,
            pht.requested_by,
            pht.add_charges,
            pht.freight,
            pht.freight_gst,
            COALESCE(pht.po_closed_flag, 'N')       AS po_closed_flag,
            pht.is_active,
            pht.created_by,
            pht.created_at,
            pht.updated_by,
            pht.updated_at
        FROM sos_po_header_t pht
        LEFT JOIN sos_supplier_master_t smt
            ON pht.supplier_id = smt.supplier_id
        WHERE pht.is_active = 1
        """)
public class SosPurchaseOrderView {

    @Id
    @Column(name = "po_ref_no")
    private Long poRefNo;

    @Column(name = "po_no")
    private String poNo;

    @Column(name = "po_date")
    private LocalDateTime poDate;

    @Column(name = "po_kind_attention")
    private String poKindAttention;

    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(name = "supplier_code")
    private String supplierCode;

    @Column(name = "supplier_name")
    private String supplierName;

    @Column(name = "po_delivery_schedule")
    private LocalDateTime poDeliverySchedule;

    @Column(name = "po_payment_terms")
    private String poPaymentTerms;

    @Column(name = "po_delivery_terms")
    private String poDeliveryTerms;

    @Column(name = "po_type")
    private String poType;

    @Column(name = "po_reference")
    private String poReference;

    @Column(name = "po_remarks")
    private String poRemarks;

    @Column(name = "po_vat")
    private java.math.BigDecimal poVat;

    @Column(name = "po_cst")
    private java.math.BigDecimal poCst;

    @Column(name = "po_ref_gen_no")
    private Long poRefGenNo;

    @Column(name = "requested_by")
    private String requestedBy;

    @Column(name = "add_charges")
    private java.math.BigDecimal addCharges;

    @Column(name = "po_closed_flag")
    private String poClosedFlag;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    @Column(name="freight")
    private String freight;
    
    @Column(name="freight_gst")
    private String freightGst;

    public Long getPoRefNo() { return poRefNo; }
    public String getPoNo() { return poNo; }
    public LocalDateTime getPoDate() { return poDate; }
    public String getPoKindAttention() { return poKindAttention; }
    public Long getSupplierId() { return supplierId; }
    public String getSupplierCode() { return supplierCode; }
    public String getSupplierName() { return supplierName; }
    public LocalDateTime getPoDeliverySchedule() { return poDeliverySchedule; }
    public String getPoPaymentTerms() { return poPaymentTerms; }
    public String getPoDeliveryTerms() { return poDeliveryTerms; }
    public String getPoType() { return poType; }
    public String getPoReference() { return poReference; }
    public String getPoRemarks() { return poRemarks; }
    public java.math.BigDecimal getPoVat() { return poVat; }
    public java.math.BigDecimal getPoCst() { return poCst; }
    public Long getPoRefGenNo() { return poRefGenNo; }
    public String getRequestedBy() { return requestedBy; }
    public java.math.BigDecimal getAddCharges() { return addCharges; }
    public String getPoClosedFlag() { return poClosedFlag; }
    public Boolean getIsActive() { return isActive; }
    public String getCreatedBy() { return createdBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getUpdatedBy() { return updatedBy; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
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