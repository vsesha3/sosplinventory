package com.sospl.inventory.model.inventory.master;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "sos_rm_master_t")
public class SosRmMaster extends BaseAuditEntity {

    @Id
    @Column(name = "rm_id", nullable = false, unique = true)
    private Integer rmId;

    @Column(name = "rm_code")
    private Integer rmCode;

    @Column(name = "rm_name", length = 250)
    private String rmName;

    @Column(name = "uom_id")
    private Integer uomId;

    @Column(name = "rm_group_id")
    private Integer rmGroupId;

    @Column(name = "avg_rate", precision = 11, scale = 2)
    private BigDecimal avgRate;

    @Column(name = "test_id")
    private Integer testId;

    @Column(name = "pack_size")
    private Integer packSize;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "pack_uom")
    private Integer packUom;

    @Column(name = "h_nh_id")
    private Integer hNhId;

	public Integer getRmId() {
		return rmId;
	}

	public void setRmId(Integer rmId) {
		this.rmId = rmId;
	}

	public Integer getRmCode() {
		return rmCode;
	}

	public void setRmCode(Integer rmCode) {
		this.rmCode = rmCode;
	}

	public String getRmName() {
		return rmName;
	}

	public void setRmName(String rmName) {
		this.rmName = rmName;
	}

	public Integer getUomId() {
		return uomId;
	}

	public void setUomId(Integer uomId) {
		this.uomId = uomId;
	}

	public Integer getRmGroupId() {
		return rmGroupId;
	}

	public void setRmGroupId(Integer rmGroupId) {
		this.rmGroupId = rmGroupId;
	}


	public BigDecimal getAvgRate() {
		return avgRate;
	}

	public void setAvgRate(BigDecimal avgRate) {
		this.avgRate = avgRate;
	}

	public Integer getTestId() {
		return testId;
	}

	public void setTestId(Integer testId) {
		this.testId = testId;
	}

	public Integer getPackSize() {
		return packSize;
	}

	public void setPackSize(Integer packSize) {
		this.packSize = packSize;
	}

	public Integer getCapacity() {
		return capacity;
	}

	public void setCapacity(Integer capacity) {
		this.capacity = capacity;
	}

	public Integer getPackUom() {
		return packUom;
	}

	public void setPackUom(Integer packUom) {
		this.packUom = packUom;
	}

	public Integer gethNhId() {
		return hNhId;
	}

	public void sethNhId(Integer hNhId) {
		this.hNhId = hNhId;
	}

    // Getters & Setters
}