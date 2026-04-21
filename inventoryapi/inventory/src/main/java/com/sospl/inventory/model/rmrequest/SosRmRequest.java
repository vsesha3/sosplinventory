package com.sospl.inventory.model.rmrequest;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sos_rm_request_t")
public class SosRmRequest extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rm_req_id")
    private Long rmReqId;

    @Column(name = "rm_req_date")
    private LocalDateTime rmReqDate;

    @Column(name = "wo_id")
    private Long woId;

    @Column(name = "request_by", length = 100)
    private String requestBy;

    @Column(name = "schedule_date")
    private LocalDateTime scheduleDate;

    @Column(name = "plan_to_prod_qty", precision = 11, scale = 2)
    private BigDecimal planToProdQty;

    @Column(name = "production_plan_id")
    private Long productionPlanId;

    @Column(name = "production_lot_number", length = 250)
    private String productionLotNumber;

    @Column(name = "is_rm_issue_completed",
            columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isRmIssueCompleted;

    @Column(name = "gin_no", length = 250)
    private String ginNo;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getRmReqId() { return rmReqId; }
    public LocalDateTime getRmReqDate() { return rmReqDate; }
    public Long getWoId() { return woId; }
    public String getRequestBy() { return requestBy; }
    public LocalDateTime getScheduleDate() { return scheduleDate; }
    public BigDecimal getPlanToProdQty() { return planToProdQty; }
    public Long getProductionPlanId() { return productionPlanId; }
    public String getProductionLotNumber() { return productionLotNumber; }
    public Boolean getIsRmIssueCompleted() { return isRmIssueCompleted; }
    public String getGinNo() { return ginNo; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setRmReqId(Long rmReqId) { this.rmReqId = rmReqId; }
    public void setRmReqDate(LocalDateTime rmReqDate) { this.rmReqDate = rmReqDate; }
    public void setWoId(Long woId) { this.woId = woId; }
    public void setRequestBy(String requestBy) { this.requestBy = requestBy; }
    public void setScheduleDate(LocalDateTime scheduleDate) { this.scheduleDate = scheduleDate; }
    public void setPlanToProdQty(BigDecimal planToProdQty) { this.planToProdQty = planToProdQty; }
    public void setProductionPlanId(Long productionPlanId) { this.productionPlanId = productionPlanId; }
    public void setProductionLotNumber(String productionLotNumber) { this.productionLotNumber = productionLotNumber; }
    public void setIsRmIssueCompleted(Boolean isRmIssueCompleted) { this.isRmIssueCompleted = isRmIssueCompleted; }
    public void setGinNo(String ginNo) { this.ginNo = ginNo; }
}