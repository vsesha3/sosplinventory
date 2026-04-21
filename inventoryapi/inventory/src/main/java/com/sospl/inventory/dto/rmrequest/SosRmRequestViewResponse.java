package com.sospl.inventory.dto.rmrequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SosRmRequestViewResponse {

    private Long rmReqId;
    private LocalDateTime rmReqDate;
    private Long woId;
    private String woCode;
    private String createdBy;
    private LocalDateTime createdOn;
    private String lastUpdatedBy;
    private LocalDateTime lastUpdatedOn;
    private Boolean isActive;
    private String requestBy;
    private LocalDateTime scheduleDate;
    private BigDecimal planToProdQty;
    private String productionLotNumber;
    private Boolean isRmIssueCompleted;
    private Long companyId;
    private Long ginNo;
    private String productCode;
    private String productName;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getRmReqId() { return rmReqId; }
    public LocalDateTime getRmReqDate() { return rmReqDate; }
    public Long getWoId() { return woId; }
    public String getWoCode() { return woCode; }
    public String getCreatedBy() { return createdBy; }
    public LocalDateTime getCreatedOn() { return createdOn; }
    public String getLastUpdatedBy() { return lastUpdatedBy; }
    public LocalDateTime getLastUpdatedOn() { return lastUpdatedOn; }
    public Boolean getIsActive() { return isActive; }
    public String getRequestBy() { return requestBy; }
    public LocalDateTime getScheduleDate() { return scheduleDate; }
    public BigDecimal getPlanToProdQty() { return planToProdQty; }
    public String getProductionLotNumber() { return productionLotNumber; }
    public Boolean getIsRmIssueCompleted() { return isRmIssueCompleted; }
    public Long getCompanyId() { return companyId; }
    public Long getGinNo() { return ginNo; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setRmReqId(Long rmReqId) { this.rmReqId = rmReqId; }
    public void setRmReqDate(LocalDateTime rmReqDate) { this.rmReqDate = rmReqDate; }
    public void setWoId(Long woId) { this.woId = woId; }
    public void setWoCode(String woCode) { this.woCode = woCode; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public void setCreatedOn(LocalDateTime createdOn) { this.createdOn = createdOn; }
    public void setLastUpdatedBy(String lastUpdatedBy) { this.lastUpdatedBy = lastUpdatedBy; }
    public void setLastUpdatedOn(LocalDateTime lastUpdatedOn) { this.lastUpdatedOn = lastUpdatedOn; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public void setRequestBy(String requestBy) { this.requestBy = requestBy; }
    public void setScheduleDate(LocalDateTime scheduleDate) { this.scheduleDate = scheduleDate; }
    public void setPlanToProdQty(BigDecimal planToProdQty) { this.planToProdQty = planToProdQty; }
    public void setProductionLotNumber(String productionLotNumber) { this.productionLotNumber = productionLotNumber; }
    public void setIsRmIssueCompleted(Boolean isRmIssueCompleted) { this.isRmIssueCompleted = isRmIssueCompleted; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public void setGinNo(Long ginNo) { this.ginNo = ginNo; }
 // Add getters
    public String getProductCode() { return productCode; }
    public String getProductName() { return productName; }

    // Add setters
    public void setProductCode(String productCode) { this.productCode = productCode; }
    public void setProductName(String productName) { this.productName = productName; }
}
