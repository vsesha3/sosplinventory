package com.sospl.inventory.dto.inventory;

import java.math.BigDecimal;

public class SosMaterialReceiptWithRMDetailsResponse {

    private Long receiptId;
    private Long receiptMainId;
    private BigDecimal noOfReceived;
    private BigDecimal perUnitRate;
    private BigDecimal sgstValue;
    private BigDecimal cgstValue;
    private BigDecimal igstValue;

    // ── Calculated ────────────────────────────────────────────────────────
    private BigDecimal netAmount;      // noOfReceived * perUnitRate
    private BigDecimal totalAmount;    // netAmount + sgstValue + cgstValue + igstValue

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getReceiptId() { return receiptId; }
    public Long getReceiptMainId() { return receiptMainId; }
    public BigDecimal getNoOfReceived() { return noOfReceived; }
    public BigDecimal getPerUnitRate() { return perUnitRate; }
    public BigDecimal getSgstValue() { return sgstValue; }
    public BigDecimal getCgstValue() { return cgstValue; }
    public BigDecimal getIgstValue() { return igstValue; }
    public BigDecimal getNetAmount() { return netAmount; }
    public BigDecimal getTotalAmount() { return totalAmount; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setReceiptId(Long receiptId) { this.receiptId = receiptId; }
    public void setReceiptMainId(Long receiptMainId) { this.receiptMainId = receiptMainId; }
    public void setNoOfReceived(BigDecimal noOfReceived) { this.noOfReceived = noOfReceived; }
    public void setPerUnitRate(BigDecimal perUnitRate) { this.perUnitRate = perUnitRate; }
    public void setSgstValue(BigDecimal sgstValue) { this.sgstValue = sgstValue; }
    public void setCgstValue(BigDecimal cgstValue) { this.cgstValue = cgstValue; }
    public void setIgstValue(BigDecimal igstValue) { this.igstValue = igstValue; }
    public void setNetAmount(BigDecimal netAmount) { this.netAmount = netAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}