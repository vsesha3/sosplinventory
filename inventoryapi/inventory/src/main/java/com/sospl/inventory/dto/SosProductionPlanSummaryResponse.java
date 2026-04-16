package com.sospl.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SosProductionPlanSummaryResponse {

    // ── From sos_production_plan_t ────────────────────────────────────────
    private Long productionPlanId;
    private LocalDateTime productionFromDate;
    private LocalDateTime productionToDate;
    private BigDecimal qty;

    // ── From sos_work_order_t ─────────────────────────────────────────────
    private Long woId;
    private String woCode;
    private Long poId;
    private String plant;
    private BigDecimal woQty;
    private BigDecimal perUnitRate;

    // ── From sos_vessel_master_t ──────────────────────────────────────────
    private String vesselName;

    // ── From sos_product_master_t ─────────────────────────────────────────
    private String productName;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getProductionPlanId() { return productionPlanId; }
    public LocalDateTime getProductionFromDate() { return productionFromDate; }
    public LocalDateTime getProductionToDate() { return productionToDate; }
    public BigDecimal getQty() { return qty; }
    public Long getWoId() { return woId; }
    public String getWoCode() { return woCode; }
    public Long getPoId() { return poId; }
    public String getPlant() { return plant; }
    public BigDecimal getWoQty() { return woQty; }
    public BigDecimal getPerUnitRate() { return perUnitRate; }
    public String getVesselName() { return vesselName; }
    public String getProductName() { return productName; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setProductionPlanId(Long productionPlanId) { this.productionPlanId = productionPlanId; }
    public void setProductionFromDate(LocalDateTime productionFromDate) { this.productionFromDate = productionFromDate; }
    public void setProductionToDate(LocalDateTime productionToDate) { this.productionToDate = productionToDate; }
    public void setQty(BigDecimal qty) { this.qty = qty; }
    public void setWoId(Long woId) { this.woId = woId; }
    public void setWoCode(String woCode) { this.woCode = woCode; }
    public void setPoId(Long poId) { this.poId = poId; }
    public void setPlant(String plant) { this.plant = plant; }
    public void setWoQty(BigDecimal woQty) { this.woQty = woQty; }
    public void setPerUnitRate(BigDecimal perUnitRate) { this.perUnitRate = perUnitRate; }
    public void setVesselName(String vesselName) { this.vesselName = vesselName; }
    public void setProductName(String productName) { this.productName = productName; }
}