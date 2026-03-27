package com.sospl.inventory.model;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "sos_po_receipt_t")
public class SosPoReceipt extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "po_receipt_no")
    private Long poReceiptNo;

    @Column(name = "receipt_det_id")
    private Long receiptDetId;

    @Column(name = "po_no")
    private Long poNo;

    @Column(name = "po_date")
    private LocalDate poDate;

    @Column(name = "rm_code", length = 100)
    private String rmCode;

    @Column(name = "rm_ord_qty", precision = 11, scale = 2)
    private BigDecimal rmOrdQty;

    @Column(name = "rm_received_qty", precision = 11, scale = 2)
    private BigDecimal rmReceivedQty;

    @Column(name = "exp_date_del")
    private LocalDate expDateDel;

    @Column(name = "act_date_del")
    private LocalDate actDateDel;

    @Column(name = "inspected_by", length = 100)
    private String inspectedBy;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "invoice_no", length = 50)
    private String invoiceNo;

    @Column(name = "po_det_id")
    private Long poDetId;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getPoReceiptNo() { return poReceiptNo; }
    public Long getReceiptDetId() { return receiptDetId; }
    public Long getPoNo() { return poNo; }
    public LocalDate getPoDate() { return poDate; }
    public String getRmCode() { return rmCode; }
    public BigDecimal getRmOrdQty() { return rmOrdQty; }
    public BigDecimal getRmReceivedQty() { return rmReceivedQty; }
    public LocalDate getExpDateDel() { return expDateDel; }
    public LocalDate getActDateDel() { return actDateDel; }
    public String getInspectedBy() { return inspectedBy; }
    public String getApprovedBy() { return approvedBy; }
    public String getInvoiceNo() { return invoiceNo; }
    public Long getPoDetId() { return poDetId; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setPoReceiptNo(Long poReceiptNo) { this.poReceiptNo = poReceiptNo; }
    public void setReceiptDetId(Long receiptDetId) { this.receiptDetId = receiptDetId; }
    public void setPoNo(Long poNo) { this.poNo = poNo; }
    public void setPoDate(LocalDate poDate) { this.poDate = poDate; }
    public void setRmCode(String rmCode) { this.rmCode = rmCode; }
    public void setRmOrdQty(BigDecimal rmOrdQty) { this.rmOrdQty = rmOrdQty; }
    public void setRmReceivedQty(BigDecimal rmReceivedQty) { this.rmReceivedQty = rmReceivedQty; }
    public void setExpDateDel(LocalDate expDateDel) { this.expDateDel = expDateDel; }
    public void setActDateDel(LocalDate actDateDel) { this.actDateDel = actDateDel; }
    public void setInspectedBy(String inspectedBy) { this.inspectedBy = inspectedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
    public void setInvoiceNo(String invoiceNo) { this.invoiceNo = invoiceNo; }
    public void setPoDetId(Long poDetId) { this.poDetId = poDetId; }
}