package com.sospl.inventory.dto.rmissue;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class SosRmIssueResponse {

    // ── Header ────────────────────────────────────────────────────────────
    private Long rmIssueId;
    private LocalDate issueDate;
    private String issueShift;
    private LocalTime issueTime;
    private Long rmReqDetlsId;
    private String receivedBy;
    private String issueBy;
    private Long rmReqId;
    private String createdBy;
    private String updatedBy;

    // ── Lines ─────────────────────────────────────────────────────────────
    private List<SosRmIssueLineResponse> lines;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getRmIssueId() { return rmIssueId; }
    public LocalDate getIssueDate() { return issueDate; }
    public String getIssueShift() { return issueShift; }
    public LocalTime getIssueTime() { return issueTime; }
    public Long getRmReqDetlsId() { return rmReqDetlsId; }
    public String getReceivedBy() { return receivedBy; }
    public String getIssueBy() { return issueBy; }
    public Long getRmReqId() { return rmReqId; }
    public String getCreatedBy() { return createdBy; }
    public String getUpdatedBy() { return updatedBy; }
    public List<SosRmIssueLineResponse> getLines() { return lines; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setRmIssueId(Long rmIssueId) { this.rmIssueId = rmIssueId; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }
    public void setIssueShift(String issueShift) { this.issueShift = issueShift; }
    public void setIssueTime(LocalTime issueTime) { this.issueTime = issueTime; }
    public void setRmReqDetlsId(Long rmReqDetlsId) { this.rmReqDetlsId = rmReqDetlsId; }
    public void setReceivedBy(String receivedBy) { this.receivedBy = receivedBy; }
    public void setIssueBy(String issueBy) { this.issueBy = issueBy; }
    public void setRmReqId(Long rmReqId) { this.rmReqId = rmReqId; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    public void setLines(List<SosRmIssueLineResponse> lines) { this.lines = lines; }
}