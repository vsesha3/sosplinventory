package com.sospl.inventory.dto.master;

import java.math.BigDecimal;

public class SosProdMasterRmDetlsResponse {

    // ── From sos_work_order_t ─────────────────────────────────────────────
    private Long woId;
    private String woCode;
    private Long productId;

    // ── From sos_rm_master_t ──────────────────────────────────────────────
    private Long rmId;
    private String rmCode;
    private String rmName;

    // ── From sos_prod_master_rm_detls_t ───────────────────────────────────
    private BigDecimal mixPercentage;

    // ── Calculated ────────────────────────────────────────────────────────
    private BigDecimal planQty;
    private BigDecimal requiredQty;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getWoId() { return woId; }
    public String getWoCode() { return woCode; }
    public Long getProductId() { return productId; }
    public Long getRmId() { return rmId; }
    public String getRmCode() { return rmCode; }
    public String getRmName() { return rmName; }
    public BigDecimal getMixPercentage() { return mixPercentage; }
    public BigDecimal getPlanQty() { return planQty; }
    public BigDecimal getRequiredQty() { return requiredQty; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setWoId(Long woId) { this.woId = woId; }
    public void setWoCode(String woCode) { this.woCode = woCode; }
    public void setProductId(Long productId) { this.productId = productId; }
    public void setRmId(Long rmId) { this.rmId = rmId; }
    public void setRmCode(String rmCode) { this.rmCode = rmCode; }
    public void setRmName(String rmName) { this.rmName = rmName; }
    public void setMixPercentage(BigDecimal mixPercentage) { this.mixPercentage = mixPercentage; }
    public void setPlanQty(BigDecimal planQty) { this.planQty = planQty; }
    public void setRequiredQty(BigDecimal requiredQty) { this.requiredQty = requiredQty; }
}