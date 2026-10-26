package com.sospl.inventory.model.master;

import org.hibernate.annotations.Formula;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "sos_prod_master_pm_detls_t")
public class SosProdMasterPmDetls extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pm_packing_detsl_id", nullable = false, unique = true)
    private Long pmPackingDetslId;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "pm_id")
    private Long pmId;
    
    @Column(name= "pack_size")
    private Long packSize;
    
 // Try with explicit column reference
    @Formula("(SELECT srm.rm_name FROM sos_rm_master_t srm WHERE srm.rm_id = pm_id LIMIT 1)")
    private String rmName;

     
    public Long getPmPackingDetslId() {
        return pmPackingDetslId;
    }

    public void setPmPackingDetslId(Long pmPackingDetslId) {
        this.pmPackingDetslId = pmPackingDetslId;
    }

    public Long getPackSize() {
		return packSize;
	}

	public void setPackSize(Long packSize) {
		this.packSize = packSize;
	}

	public String getRmName() {
		return rmName;
	}

	public void setRmName(String rmName) {
		this.rmName = rmName;
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