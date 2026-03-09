package com.sospl.inventory.model.inventory.master;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "sos_prod_master_pm_detls_t")
public class SosProdMasterPmDetls extends BaseAuditEntity {

    @Id
    @Column(name = "pm_packing_detsl_id", nullable = false, unique = true)
    private Long pmPackingDetslId;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "pm_id")
    private Long pmId;

    public Long getPmPackingDetslId() {
        return pmPackingDetslId;
    }

    public void setPmPackingDetslId(Long pmPackingDetslId) {
        this.pmPackingDetslId = pmPackingDetslId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getPmId() {
        return pmId;
    }

    public void setPmId(Long pmId) {
        this.pmId = pmId;
    }
}