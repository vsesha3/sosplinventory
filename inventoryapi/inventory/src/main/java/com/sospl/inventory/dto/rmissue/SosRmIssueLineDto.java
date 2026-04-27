package com.sospl.inventory.dto.rmissue;

public class SosRmIssueLineDto {

    private String rmIssueDetailsId;
    private String rmReceiptId;
    private String rmReqDetlsId;
    private String issueQty;
    private String remark;

    // ── Getters and Setters ───────────────────────────────────────────────
    public String getRmIssueDetailsId() { return rmIssueDetailsId; }
    public void setRmIssueDetailsId(String rmIssueDetailsId) { this.rmIssueDetailsId = rmIssueDetailsId; }

    public String getRmReceiptId() { return rmReceiptId; }
    public void setRmReceiptId(String rmReceiptId) { this.rmReceiptId = rmReceiptId; }

    public String getRmReqDetlsId() { return rmReqDetlsId; }
    public void setRmReqDetlsId(String rmReqDetlsId) { this.rmReqDetlsId = rmReqDetlsId; }

    public String getIssueQty() { return issueQty; }
    public void setIssueQty(String issueQty) { this.issueQty = issueQty; }

    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
}