package com.sospl.inventory.model.inventory.master;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_pm_master_t")
public class SosPmMaster extends BaseAuditEntity {

    @Id
    @Column(name = "pm_id", nullable = false, unique = true)
    private Integer pmId;

    @Column(name = "pm_code")
    private Long pmCode;

    @Column(name = "pm_name", length = 250)
    private String pmName;

    @Column(name = "pm_size")
    private Integer pmSize;

    @Column(name = "fg_lot_code", length = 10)
    private String fgLotCode;

 
    public Integer getPmId() {
		return pmId;
	}

	public void setPmId(Integer pmId) {
		this.pmId = pmId;
	}

	public Long getPmCode() {
		return pmCode;
	}

	public void setPmCode(Long  pmCode) {
		this.pmCode = pmCode;
	}
	

	public String getPmName() {
		return pmName;
	}

	public void setPmName(String pmName) {
		this.pmName = pmName;
	}

	public Integer getPmSize() {
		return pmSize;
	}

	public void setPmSize(Integer pmSize) {
		this.pmSize = pmSize;
	}

	public String getFgLotCode() {
		return fgLotCode;
	}

	public void setFgLotCode(String fgLotCode) {
		this.fgLotCode = fgLotCode;
	}

	public BigDecimal getAvgRate() {
		return avgRate;
	}

	public void setAvgRate(BigDecimal avgRate) {
		this.avgRate = avgRate;
	}

	public Integer getPmGroupId() {
		return pmGroupId;
	}

	public void setPmGroupId(Integer pmGroupId) {
		this.pmGroupId = pmGroupId;
	}

	public BigDecimal getTareWgt() {
		return tareWgt;
	}

	public void setTareWgt(BigDecimal tareWgt) {
		this.tareWgt = tareWgt;
	}

	public Integer getUomId() {
		return uomId;
	}

	public void setUomId(Integer uomId) {
		this.uomId = uomId;
	}

	public Integer gethNhId() {
		return hNhId;
	}

	public void sethNhId(Integer hNhId) {
		this.hNhId = hNhId;
	}

	@Column(name = "avg_rate", precision = 11, scale = 2)
    private BigDecimal avgRate;

    @Column(name = "pm_group_id")
    private Integer pmGroupId;

    @Column(name = "tare_wgt", precision = 11, scale = 2)
    private BigDecimal tareWgt;

    @Column(name = "uom_id")
    private Integer uomId;

    @Column(name = "h_nh_id")
    private Integer hNhId;

    // Getters & Setters
}