package com.sospl.inventory.dto.rmissue;

import java.util.List;

public class SosRmIssueDto {

    // ── Header fields ─────────────────────────────────────────────────────
    private String rmIssueId;
    private String issueDate;
    private String issueShift;
    private String issueTime;
    private String rmReqDetlsId;
    private String receivedBy;
    private String issueBy;
    private String rmReqId;

    // ── Line items ────────────────────────────────────────────────────────
    private List<SosRmIssueLineDto> lines;

    // ── Getters and Setters ───────────────────────────────────────────────
    public String getRmIssueId() { return rmIssueId; }
    public void setRmIssueId(String rmIssueId) { this.rmIssueId = rmIssueId; }

    public String getIssueDate() { return issueDate; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }

    public String getIssueShift() { return issueShift; }
    public void setIssueShift(String issueShift) { this.issueShift = issueShift; }

    public String getIssueTime() { return issueTime; }
    public void setIssueTime(String issueTime) { this.issueTime = issueTime; }

    public String getRmReqDetlsId() { return rmReqDetlsId; }
    public void setRmReqDetlsId(String rmReqDetlsId) { this.rmReqDetlsId = rmReqDetlsId; }

    public String getReceivedBy() { return receivedBy; }
    public void setReceivedBy(String receivedBy) { this.receivedBy = receivedBy; }

    public String getIssueBy() { return issueBy; }
    public void setIssueBy(String issueBy) { this.issueBy = issueBy; }

    public String getRmReqId() { return rmReqId; }
    public void setRmReqId(String rmReqId) { this.rmReqId = rmReqId; }

    public List<SosRmIssueLineDto> getLines() { return lines; }
    public void setLines(List<SosRmIssueLineDto> lines) { this.lines = lines; }
}