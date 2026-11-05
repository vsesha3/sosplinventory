package com.sospl.inventory.model.rmrequest;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

import org.hibernate.annotations.Formula;

@Entity
@Table(name = "sos_rm_request_detls_t")
public class SosRmRequestDetls extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rm_req_detls_id")
    private Long rmReqDetlsId;

    @Column(name = "rm_req_id")
    private Long rmReqId;

    @Column(name = "rm_id")
    private Long rmId;

    @Column(name = "qty", precision = 11, scale = 2)
    private BigDecimal qty;
    
    @Formula("""
    	    COALESCE((
    	        SELECT SUM(rid.issue_qty)
    	        FROM sos_rm_issue_details_t rid
    	        INNER JOIN sos_rm_issue_t ri
    	            ON ri.rm_issue_id = rid.rm_issue_id
    	        WHERE ri.rm_req_id = rm_req_id
    	          AND rid.rm_req_detls_id IN (
    	              SELECT rmd.rm_req_detls_id
    	              FROM sos_rm_request_detls_t rmd
    	              WHERE rmd.rm_req_id = rm_req_id
    	                AND rmd.rm_id = rm_id
    	          )
    	          AND COALESCE(rid.is_active, 1) = 1
    	          AND COALESCE(rid.is_deleted, 0) = 0
    	          AND COALESCE(ri.is_active, 1) = 1
    	          AND COALESCE(ri.is_deleted, 0) = 0
    	    ), 0)
    	    """)
    	private BigDecimal issuedQty;
    
  
    
    
    

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getRmReqDetlsId() { return rmReqDetlsId; }
    public Long getRmReqId() { return rmReqId; }
    public Long getRmId() { return rmId; }
    public BigDecimal getQty() { return qty; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setRmReqDetlsId(Long rmReqDetlsId) { this.rmReqDetlsId = rmReqDetlsId; }
    public void setRmReqId(Long rmReqId) { this.rmReqId = rmReqId; }
    public void setRmId(Long rmId) { this.rmId = rmId; }
    public void setQty(BigDecimal qty) { this.qty = qty; }
    public BigDecimal getIssuedQty() {
        return issuedQty;
    }
}