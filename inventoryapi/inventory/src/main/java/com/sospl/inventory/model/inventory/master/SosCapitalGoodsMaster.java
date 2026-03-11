package com.sospl.inventory.model.inventory.master;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_capital_goods_master_t")
public class SosCapitalGoodsMaster extends BaseAuditEntity {

    @Id
    @Column(name = "cg_id", nullable = false, unique = true)
    private Long cgId;

    @Column(name = "cg_code", length = 25)
    private String cgCode;

    @Column(name = "cg_name", length = 100)
    private String cgName;

  
    public Long getCgId() {
		return cgId;
	}

	public void setCgId(Long cgId) {
		this.cgId = cgId;
	}

	public String getCgCode() {
		return cgCode;
	}

	public void setCgCode(String cgCode) {
		this.cgCode = cgCode;
	}

	public String getCgName() {
		return cgName;
	}

	public void setCgName(String cgName) {
		this.cgName = cgName;
	}

	public Integer getUom() {
		return uomId;
	}

	public void setUom(Integer uom) {
		this.uomId = uomId;
	}

	public BigDecimal getAvgRate() {
		return avgRate;
	}

	public void setAvgRate(BigDecimal avgRate) {
		this.avgRate = avgRate;
	}

	@Column(name = "uom_id")
    private Integer uomId;

    @Column(name = "avg_rate", precision = 11, scale = 2)
    private BigDecimal avgRate;

    // Getters & Setters
}