package com.sospl.inventory.model;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sos_production_plan_t")
public class SosProductionPlan extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "production_plan_id")
    private Long productionPlanId;

    @Column(name = "production_from_date")
    private LocalDateTime productionFromDate;

    @Column(name = "production_from_shift", length = 50)
    private String productionFromShift;

    @Column(name = "production_to_date")
    private LocalDateTime productionToDate;

    @Column(name = "production_to_shift", length = 50)
    private String productionToShift;

    @Column(name = "wo_id")
    private Long woId;

    @Column(name = "qty", precision = 11, scale = 2)
    private BigDecimal qty;

    @Column(name = "vessel_id")
    private Long vesselId;

    @Column(name = "coa_reference", length = 250)
    private String coaReference;

    // ── Transient fields — not stored in DB ───────────────────────────────
    @Transient
    private String productName;

    @Transient
    private String productCode;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getProductionPlanId() { return productionPlanId; }
    public LocalDateTime getProductionFromDate() { return productionFromDate; }
    public String getProductionFromShift() { return productionFromShift; }
    public LocalDateTime getProductionToDate() { return productionToDate; }
    public String getProductionToShift() { return productionToShift; }
    public Long getWoId() { return woId; }
    public BigDecimal getQty() { return qty; }
    public Long getVesselId() { return vesselId; }
    public String getCoaReference() { return coaReference; }
    public String getProductName() { return productName; }
    public String getProductCode() { return productCode; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setProductionPlanId(Long productionPlanId) { this.productionPlanId = productionPlanId; }
    public void setProductionFromDate(LocalDateTime productionFromDate) { this.productionFromDate = productionFromDate; }
    public void setProductionFromShift(String productionFromShift) { this.productionFromShift = productionFromShift; }
    public void setProductionToDate(LocalDateTime productionToDate) { this.productionToDate = productionToDate; }
    public void setProductionToShift(String productionToShift) { this.productionToShift = productionToShift; }
    public void setWoId(Long woId) { this.woId = woId; }
    public void setQty(BigDecimal qty) { this.qty = qty; }
    public void setVesselId(Long vesselId) { this.vesselId = vesselId; }
    public void setCoaReference(String coaReference) { this.coaReference = coaReference; }
    public void setProductName(String productName) { this.productName = productName; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
}