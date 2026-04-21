package com.sospl.inventory.model.master;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "sos_prod_master_rm_detls_t")
public class SosProdMasterRmDetls extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pm_rm_detsl_id")
    private Long pmRmDetslId;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "rm_id")
    private Long rmId;

    @Column(name = "mixpercentage", precision = 5, scale = 2)
    private BigDecimal mixPercentage;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getPmRmDetslId() { return pmRmDetslId; }
    public Long getProductId() { return productId; }
    public Long getRmId() { return rmId; }
    public BigDecimal getMixPercentage() { return mixPercentage; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setPmRmDetslId(Long pmRmDetslId) { this.pmRmDetslId = pmRmDetslId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public void setRmId(Long rmId) { this.rmId = rmId; }
    public void setMixPercentage(BigDecimal mixPercentage) { this.mixPercentage = mixPercentage; }
}