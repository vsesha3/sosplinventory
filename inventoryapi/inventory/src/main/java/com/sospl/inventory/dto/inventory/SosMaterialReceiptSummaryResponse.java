package com.sospl.inventory.dto.inventory;

import java.math.BigDecimal;

public class SosMaterialReceiptSummaryResponse {

    private Long receiptDetId;
    private Long poRefNo;
    private String materialType;
    private String invoiceNo;
    private Long supplierId;
    private String invoiceDate;

    // ── Tax Values ────────────────────────────────────────────────────────
    private BigDecimal sgstValue;
    private BigDecimal cgstValue;
    private BigDecimal igstValue;

    // ── Quantity and Rate ─────────────────────────────────────────────────
    private BigDecimal noOfReceived;
    private BigDecimal netAmount;       // ← sum of no_of_received * per_unit_rate

    // ── Total = sgstValue + cgstValue + igstValue + netAmount ─────────────
    private BigDecimal totalAmount;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getReceiptDetId() { return receiptDetId; }
    public Long getPoRefNo() { return poRefNo; }
    public String getMaterialType() { return materialType; }
    public String getInvoiceNo() { return invoiceNo; }
    public Long getSupplierId() { return supplierId; }
    public String getInvoiceDate() { return invoiceDate; }
    public BigDecimal getSgstValue() { return sgstValue; }
    public BigDecimal getCgstValue() { return cgstValue; }
    public BigDecimal getIgstValue() { return igstValue; }
    public BigDecimal getNoOfReceived() { return noOfReceived; }
    public BigDecimal getNetAmount() { return netAmount; }
    public BigDecimal getTotalAmount() { return totalAmount; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setReceiptDetId(Long receiptDetId) { this.receiptDetId = receiptDetId; }
    public void setPoRefNo(Long poRefNo) { this.poRefNo = poRefNo; }
    public void setMaterialType(String materialType) { this.materialType = materialType; }
    public void setInvoiceNo(String invoiceNo) { this.invoiceNo = invoiceNo; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public void setInvoiceDate(String invoiceDate) { this.invoiceDate = invoiceDate; }
    public void setSgstValue(BigDecimal sgstValue) { this.sgstValue = sgstValue; }
    public void setCgstValue(BigDecimal cgstValue) { this.cgstValue = cgstValue; }
    public void setIgstValue(BigDecimal igstValue) { this.igstValue = igstValue; }
    public void setNoOfReceived(BigDecimal noOfReceived) { this.noOfReceived = noOfReceived; }
    public void setNetAmount(BigDecimal netAmount) { this.netAmount = netAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}