package com.sospl.inventory.dto.inventory.master;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SosRmMasterRequest {

    // ← Removed @NotNull — auto generated
    private Integer rmCode;

    @NotBlank(message = "RM name is required")
    @Size(max = 250, message = "RM name must not exceed 250 characters")
    private String rmName;

    @NotNull(message = "UOM is required")
    private Integer uomId;

    @NotNull(message = "RM group is required")
    private Integer rmGroupId;

    private Integer testId;
    private Integer exciseTariffNo;
    private Integer exciseDeclaredItem;
    private BigDecimal exciseRate;
    private BigDecimal eCessRate;
    private BigDecimal shECessRate;
    private BigDecimal avgRate;
    private Integer packSize;
    private Integer capacity;
    private Integer packUom;
    @JsonProperty("hNhId")
    private Long hNhId;
    private String materialType;
   
    public Long gethNhId() {
		return hNhId;
	}
	public void sethNhId(Long hNhId) {
		this.hNhId = hNhId;
	}
	public String getMaterialType() {
		return materialType;
	}
	public void setMaterialType(String materialType) {
		this.materialType = materialType;
	}
	// ── Getters and Setters ───────────────────────────────────────────────
    public Integer getRmCode() { return rmCode; }
    public void setRmCode(Integer rmCode) { this.rmCode = rmCode; }

    public String getRmName() { return rmName; }
    public void setRmName(String rmName) { this.rmName = rmName; }

    public Integer getUomId() { return uomId; }
    public void setUomId(Integer uomId) { this.uomId = uomId; }

    public Integer getRmGroupId() { return rmGroupId; }
    public void setRmGroupId(Integer rmGroupId) { this.rmGroupId = rmGroupId; }

    public Integer getTestId() { return testId; }
    public void setTestId(Integer testId) { this.testId = testId; }

    public Integer getExciseTariffNo() { return exciseTariffNo; }
    public void setExciseTariffNo(Integer exciseTariffNo) { this.exciseTariffNo = exciseTariffNo; }

    public Integer getExciseDeclaredItem() { return exciseDeclaredItem; }
    public void setExciseDeclaredItem(Integer exciseDeclaredItem) { this.exciseDeclaredItem = exciseDeclaredItem; }

    public BigDecimal getExciseRate() { return exciseRate; }
    public void setExciseRate(BigDecimal exciseRate) { this.exciseRate = exciseRate; }

    public BigDecimal getECessRate() { return eCessRate; }
    public void setECessRate(BigDecimal eCessRate) { this.eCessRate = eCessRate; }

    public BigDecimal getShECessRate() { return shECessRate; }
    public void setShECessRate(BigDecimal shECessRate) { this.shECessRate = shECessRate; }

    public BigDecimal getAvgRate() { return avgRate; }
    public void setAvgRate(BigDecimal avgRate) { this.avgRate = avgRate; }

    public Integer getPackSize() { return packSize; }
    public void setPackSize(Integer packSize) { this.packSize = packSize; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Integer getPackUom() { return packUom; }
    public void setPackUom(Integer packUom) { this.packUom = packUom; }

    public Long getHNhId() { return hNhId; }
    public void setHNhId(Long hNhId) { this.hNhId = hNhId; }
}