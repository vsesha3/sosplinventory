package com.sospl.inventory.dto.rmrequest;

import java.math.BigDecimal;

public class SosRmRequestLineDto {

    private String rmId;
    private String rmCode;
    private String rmName;
    private BigDecimal mixPercentage;
    private BigDecimal planQty;
    private BigDecimal requiredQty;
    private String woId;

    // ── Getters and Setters ───────────────────────────────────────────────
    public String getRmId() { return rmId; }
    public void setRmId(String rmId) { this.rmId = rmId; }

    public String getRmCode() { return rmCode; }
    public void setRmCode(String rmCode) { this.rmCode = rmCode; }

    public String getRmName() { return rmName; }
    public void setRmName(String rmName) { this.rmName = rmName; }

    public BigDecimal getMixPercentage() { return mixPercentage; }
    public void setMixPercentage(BigDecimal mixPercentage) { this.mixPercentage = mixPercentage; }

    public BigDecimal getPlanQty() { return planQty; }
    public void setPlanQty(BigDecimal planQty) { this.planQty = planQty; }

    public BigDecimal getRequiredQty() { return requiredQty; }
    public void setRequiredQty(BigDecimal requiredQty) { this.requiredQty = requiredQty; }

    public String getWoId() { return woId; }
    public void setWoId(String woId) { this.woId = woId; }
}