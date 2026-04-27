package com.sospl.inventory.dto.rmissue;

import java.math.BigDecimal;

public class SosRmIssueLineResponse {

    private Long rmIssueDetailsId;
    private Long rmIssueId;
    private BigDecimal issueQty;
    private Long rmReceiptId;
    private Long rmReqDetlsId;
    private String remark;
    private BigDecimal totalIssuedQty;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getRmIssueDetailsId() { return rmIssueDetailsId; }
    public Long getRmIssueId() { return rmIssueId; }
    public BigDecimal getIssueQty() { return issueQty; }
    public Long getRmReceiptId() { return rmReceiptId; }
    public Long getRmReqDetlsId() { return rmReqDetlsId; }
    public String getRemark() { return remark; }
    public BigDecimal getTotalIssuedQty() { return totalIssuedQty; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setRmIssueDetailsId(Long rmIssueDetailsId) { this.rmIssueDetailsId = rmIssueDetailsId; }
    public void setRmIssueId(Long rmIssueId) { this.rmIssueId = rmIssueId; }
    public void setIssueQty(BigDecimal issueQty) { this.issueQty = issueQty; }
    public void setRmReceiptId(Long rmReceiptId) { this.rmReceiptId = rmReceiptId; }
    public void setRmReqDetlsId(Long rmReqDetlsId) { this.rmReqDetlsId = rmReqDetlsId; }
    public void setRemark(String remark) { this.remark = remark; }
    public void setTotalIssuedQty(BigDecimal totalIssuedQty) { this.totalIssuedQty = totalIssuedQty; }
}