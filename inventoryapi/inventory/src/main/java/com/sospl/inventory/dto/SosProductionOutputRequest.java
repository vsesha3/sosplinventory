package com.sospl.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SosProductionOutputRequest {

    private Long productionPlanId;

    private String productionLotNo;

    private LocalDateTime productionDate;

    private BigDecimal producedQty;

    private String remarks;

    private String createdBy;

    public Long getProductionPlanId() {
        return productionPlanId;
    }

    public void setProductionPlanId(Long productionPlanId) {
        this.productionPlanId = productionPlanId;
    }

    public String getProductionLotNo() {
        return productionLotNo;
    }

    public void setProductionLotNo(String productionLotNo) {
        this.productionLotNo = productionLotNo;
    }

    public LocalDateTime getProductionDate() {
        return productionDate;
    }

    public void setProductionDate(LocalDateTime productionDate) {
        this.productionDate = productionDate;
    }

    public BigDecimal getProducedQty() {
        return producedQty;
    }

    public void setProducedQty(BigDecimal producedQty) {
        this.producedQty = producedQty;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}