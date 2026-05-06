package com.sospl.inventory.model.inventory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Immutable
@Table(name = "sos_rm_stock_fifo_v")
public class SosRmStockFifoView {

    @Id
    @Column(name = "receiptId")
    private Long receiptId;

    @Column(name = "lotNo")
    private String lotNo;

    @Column(name = "totalQty")
    private BigDecimal totalQty;

    @Column(name = "perUnitRate")
    private BigDecimal perUnitRate;

    @Column(name = "rmId")
    private Long rmId;

    @Column(name = "rmName")
    private String rmName;

    @Column(name = "rmCode")
    private Long rmCode;

    @Column(name = "receiptDate")
    private LocalDate receiptDate;

    @Column(name = "grnNo")
    private String grnNo;

    @Column(name = "invoiceNo")
    private String invoiceNo;

    @Column(name = "supplierId")
    private Long supplierId;

    @Column(name = "receiptDetId")
    private Long receiptDetId;

    @Column(name = "issuedQty")
    private BigDecimal issuedQty;

    @Column(name = "remainingQty")
    private BigDecimal remainingQty;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getReceiptId() { return receiptId; }
    public String getLotNo() { return lotNo; }
    public BigDecimal getTotalQty() { return totalQty; }
    public BigDecimal getPerUnitRate() { return perUnitRate; }
    public Long getRmId() { return rmId; }
    public String getRmName() { return rmName; }
    public Long getRmCode() { return rmCode; }
    public LocalDate getReceiptDate() { return receiptDate; }
    public String getGrnNo() { return grnNo; }
    public String getInvoiceNo() { return invoiceNo; }
    public Long getSupplierId() { return supplierId; }
    public Long getReceiptDetId() { return receiptDetId; }
    public BigDecimal getIssuedQty() { return issuedQty; }
    public BigDecimal getRemainingQty() { return remainingQty; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setReceiptId(Long receiptId) { this.receiptId = receiptId; }
    public void setLotNo(String lotNo) { this.lotNo = lotNo; }
    public void setTotalQty(BigDecimal totalQty) { this.totalQty = totalQty; }
    public void setPerUnitRate(BigDecimal perUnitRate) { this.perUnitRate = perUnitRate; }
    public void setRmId(Long rmId) { this.rmId = rmId; }
    public void setRmName(String rmName) { this.rmName = rmName; }
    public void setRmCode(Long rmCode) { this.rmCode = rmCode; }
    public void setReceiptDate(LocalDate receiptDate) { this.receiptDate = receiptDate; }
    public void setGrnNo(String grnNo) { this.grnNo = grnNo; }
    public void setInvoiceNo(String invoiceNo) { this.invoiceNo = invoiceNo; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public void setReceiptDetId(Long receiptDetId) { this.receiptDetId = receiptDetId; }
    public void setIssuedQty(BigDecimal issuedQty) { this.issuedQty = issuedQty; }
    public void setRemainingQty(BigDecimal remainingQty) { this.remainingQty = remainingQty; }
}