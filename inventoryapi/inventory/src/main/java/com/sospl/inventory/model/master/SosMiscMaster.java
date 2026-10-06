package com.sospl.inventory.model.master;

import jakarta.persistence.*;
import java.math.BigDecimal;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_misc_master_t")
public class SosMiscMaster extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "misc_id")
    private Long miscId;

    @Column(name = "misc_code", nullable = false, length = 50)
    private String miscCode;

    @Column(name = "misc_name", nullable = false, length = 100)
    private String miscName;

    @Column(name = "avg_rate", precision = 11, scale = 2)
    private BigDecimal avgRate;

    @Column(name = "uom_id", nullable = false)
    private Long uomId;

    public Long getMiscId() {
        return miscId;
    }

    public void setMiscId(Long miscId) {
        this.miscId = miscId;
    }

    public String getMiscCode() {
        return miscCode;
    }

    public void setMiscCode(String miscCode) {
        this.miscCode = miscCode;
    }

    public String getMiscName() {
        return miscName;
    }

    public void setMiscName(String miscName) {
        this.miscName = miscName;
    }

    public BigDecimal getAvgRate() {
        return avgRate;
    }

    public void setAvgRate(BigDecimal avgRate) {
        this.avgRate = avgRate;
    }

    public Long getUomId() {
        return uomId;
    }

    public void setUomId(Long uomId) {
        this.uomId = uomId;
    }
}