package com.sospl.inventory.model.rmissue;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "sos_rm_issue_t")
public class SosRmIssue extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rm_issue_id")
    private Long rmIssueId;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "issue_shift", length = 50)
    private String issueShift;

    @Column(name = "issue_time")
    private LocalTime issueTime;

    @Column(name = "rm_req_detls_id")
    private Long rmReqDetlsId;

    @Column(name = "received_by", length = 100)
    private String receivedBy;

    @Column(name = "issue_by", length = 100)
    private String issueBy;

    @Column(name = "rm_req_id")
    private Long rmReqId;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getRmIssueId() { return rmIssueId; }
    public LocalDate getIssueDate() { return issueDate; }
    public String getIssueShift() { return issueShift; }
    public LocalTime getIssueTime() { return issueTime; }
    public Long getRmReqDetlsId() { return rmReqDetlsId; }
    public String getReceivedBy() { return receivedBy; }
    public String getIssueBy() { return issueBy; }
    public Long getRmReqId() { return rmReqId; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setRmIssueId(Long rmIssueId) { this.rmIssueId = rmIssueId; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }
    public void setIssueShift(String issueShift) { this.issueShift = issueShift; }
    public void setIssueTime(LocalTime issueTime) { this.issueTime = issueTime; }
    public void setRmReqDetlsId(Long rmReqDetlsId) { this.rmReqDetlsId = rmReqDetlsId; }
    public void setReceivedBy(String receivedBy) { this.receivedBy = receivedBy; }
    public void setIssueBy(String issueBy) { this.issueBy = issueBy; }
    public void setRmReqId(Long rmReqId) { this.rmReqId = rmReqId; }
}