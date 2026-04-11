package com.sospl.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SosProductionPlanResponse {

    // ── From sos_production_plan_t ────────────────────────────────────────
    private Long productionPlanId;
    private BigDecimal qty;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
    private LocalDateTime createdOn;

    // ── From sos_work_order_t ─────────────────────────────────────────────
    private Long woId;
    private String woCode;

    // ── From sos_pm_master_t ──────────────────────────────────────────────
    private Long pmId;
    private String pmName;
    private BigDecimal pmSize;
    private BigDecimal pmReq;

    // ── From sos_purchase_order_t + sos_company_master_t ─────────────────
    private Long companyId;
    private String companyName;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getProductionPlanId() { return productionPlanId; }
    public BigDecimal getQty() { return qty; }
    public LocalDateTime getFromDate() { return fromDate; }
    public LocalDateTime getToDate() { return toDate; }
    public LocalDateTime getCreatedOn() { return createdOn; }
    public Long getWoId() { return woId; }
    public String getWoCode() { return woCode; }
    public Long getPmId() { return pmId; }
    public String getPmName() { return pmName; }
    public BigDecimal getPmSize() { return pmSize; }
    public BigDecimal getPmReq() { return pmReq; }
    public Long getCompanyId() { return companyId; }
    public String getCompanyName() { return companyName; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setProductionPlanId(Long productionPlanId) { this.productionPlanId = productionPlanId; }
    public void setQty(BigDecimal qty) { this.qty = qty; }
    public void setFromDate(LocalDateTime fromDate) { this.fromDate = fromDate; }
    public void setToDate(LocalDateTime toDate) { this.toDate = toDate; }
    public void setCreatedOn(LocalDateTime createdOn) { this.createdOn = createdOn; }
    public void setWoId(Long woId) { this.woId = woId; }
    public void setWoCode(String woCode) { this.woCode = woCode; }
    public void setPmId(Long pmId) { this.pmId = pmId; }
    public void setPmName(String pmName) { this.pmName = pmName; }
    public void setPmSize(BigDecimal pmSize) { this.pmSize = pmSize; }
    public void setPmReq(BigDecimal pmReq) { this.pmReq = pmReq; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
}