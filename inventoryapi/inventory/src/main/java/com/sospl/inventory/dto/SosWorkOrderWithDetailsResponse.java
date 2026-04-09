package com.sospl.inventory.dto;

import java.math.BigDecimal;

public class SosWorkOrderWithDetailsResponse {

    // ── From sos_work_order_t ─────────────────────────────────────────────
    private Long woId;
    private Long poId;
    private String plant;
    private BigDecimal qty;
    private BigDecimal perUnitRate;

    // ── From sos_product_master_t ─────────────────────────────────────────
    private Long productId;
    private String productCode;
    private String productName;

    // ── From sos_pm_master_t ──────────────────────────────────────────────
    private Long pmId;
    private String pmName;

    // ── Calculated ────────────────────────────────────────────────────────
    private BigDecimal totalAmount;  // qty * perUnitRate

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getWoId() { return woId; }
    public Long getPoId() { return poId; }
    public String getPlant() { return plant; }
    public BigDecimal getQty() { return qty; }
    public BigDecimal getPerUnitRate() { return perUnitRate; }
    public Long getProductId() { return productId; }
    public String getProductCode() { return productCode; }
    public String getProductName() { return productName; }
    public Long getPmId() { return pmId; }
    public String getPmName() { return pmName; }
    public BigDecimal getTotalAmount() { return totalAmount; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setWoId(Long woId) { this.woId = woId; }
    public void setPoId(Long poId) { this.poId = poId; }
    public void setPlant(String plant) { this.plant = plant; }
    public void setQty(BigDecimal qty) { this.qty = qty; }
    public void setPerUnitRate(BigDecimal perUnitRate) { this.perUnitRate = perUnitRate; }
    public void setProductId(Long productId) { this.productId = productId; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
    public void setProductName(String productName) { this.productName = productName; }
    public void setPmId(Long pmId) { this.pmId = pmId; }
    public void setPmName(String pmName) { this.pmName = pmName; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}