package com.sospl.inventory.model.rmrequest;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

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
}