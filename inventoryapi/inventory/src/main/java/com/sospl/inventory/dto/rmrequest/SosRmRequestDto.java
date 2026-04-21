package com.sospl.inventory.dto.rmrequest;

import java.util.List;

public class SosRmRequestDto {

    // ── Header fields ─────────────────────────────────────────────────────
    private String rmReqId;
    private String rmReqDate;
    private String woId;
    private String requestBy;
    private String scheduleDate;
    private String planToProdQty;
    private String productionPlanId;
    private String productionLotNumber;
    private String isRmIssueCompleted;
    private String ginNo;

    // ── Line items ────────────────────────────────────────────────────────
    private List<SosRmRequestLineDto> lines;

    // ── Getters and Setters ───────────────────────────────────────────────
    public String getRmReqId() { return rmReqId; }
    public void setRmReqId(String rmReqId) { this.rmReqId = rmReqId; }

    public String getRmReqDate() { return rmReqDate; }
    public void setRmReqDate(String rmReqDate) { this.rmReqDate = rmReqDate; }

    public String getWoId() { return woId; }
    public void setWoId(String woId) { this.woId = woId; }

    public String getRequestBy() { return requestBy; }
    public void setRequestBy(String requestBy) { this.requestBy = requestBy; }

    public String getScheduleDate() { return scheduleDate; }
    public void setScheduleDate(String scheduleDate) { this.scheduleDate = scheduleDate; }

    public String getPlanToProdQty() { return planToProdQty; }
    public void setPlanToProdQty(String planToProdQty) { this.planToProdQty = planToProdQty; }

    public String getProductionPlanId() { return productionPlanId; }
    public void setProductionPlanId(String productionPlanId) { this.productionPlanId = productionPlanId; }

    public String getProductionLotNumber() { return productionLotNumber; }
    public void setProductionLotNumber(String productionLotNumber) { this.productionLotNumber = productionLotNumber; }

    public String getIsRmIssueCompleted() { return isRmIssueCompleted; }
    public void setIsRmIssueCompleted(String isRmIssueCompleted) { this.isRmIssueCompleted = isRmIssueCompleted; }

    public String getGinNo() { return ginNo; }
    public void setGinNo(String ginNo) { this.ginNo = ginNo; }

    public List<SosRmRequestLineDto> getLines() { return lines; }
    public void setLines(List<SosRmRequestLineDto> lines) { this.lines = lines; }
}