package com.sospl.inventory.model.rmissue;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "sos_rm_issue_details_t")
public class SosRmIssueDetails extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rm_issue_details_id")
    private Long rmIssueDetailsId;

    @Column(name = "rm_issue_id")
    private Long rmIssueId;

    @Column(name = "issue_qty", precision = 11, scale = 2)
    private BigDecimal issueQty;

    @Column(name = "rm_receipt_id")
    private Long rmReceiptId;

    @Column(name = "rm_req_detls_id")
    private Long rmReqDetlsId;

    @Column(name = "remark", length = 500)
    private String remark;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getRmIssueDetailsId() { return rmIssueDetailsId; }
    public Long getRmIssueId() { return rmIssueId; }
    public BigDecimal getIssueQty() { return issueQty; }
    public Long getRmReceiptId() { return rmReceiptId; }
    public Long getRmReqDetlsId() { return rmReqDetlsId; }
    public String getRemark() { return remark; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setRmIssueDetailsId(Long rmIssueDetailsId) { this.rmIssueDetailsId = rmIssueDetailsId; }
    public void setRmIssueId(Long rmIssueId) { this.rmIssueId = rmIssueId; }
    public void setIssueQty(BigDecimal issueQty) { this.issueQty = issueQty; }
    public void setRmReceiptId(Long rmReceiptId) { this.rmReceiptId = rmReceiptId; }
    public void setRmReqDetlsId(Long rmReqDetlsId) { this.rmReqDetlsId = rmReqDetlsId; }
    public void setRemark(String remark) { this.remark = remark; }
}