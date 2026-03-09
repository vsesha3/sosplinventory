package com.sospl.inventory.model.inventory.master;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_product_master_t")
public class SosProductMaster extends BaseAuditEntity {

    public Integer getProductId() {
		return productId;
	}

	public void setProductId(Integer productId) {
		this.productId = productId;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public Integer getUomId() {
		return uomId;
	}

	public void setUomId(Integer uomId) {
		this.uomId = uomId;
	}

	public Integer getProductCode() {
		return productCode;
	}

	public void setProductCode(Integer productCode) {
		this.productCode = productCode;
	}

	public String getFgLotCode() {
		return fgLotCode;
	}

	public void setFgLotCode(String fgLotCode) {
		this.fgLotCode = fgLotCode;
	}

	public Integer getProductGroupId() {
		return productGroupId;
	}

	public void setProductGroupId(Integer productGroupId) {
		this.productGroupId = productGroupId;
	}

	public BigDecimal getRate() {
		return rate;
	}

	public void setRate(BigDecimal rate) {
		this.rate = rate;
	}

	public Integer getTestId() {
		return testId;
	}

	public void setTestId(Integer testId) {
		this.testId = testId;
	}

	public BigDecimal getConversionCost() {
		return conversionCost;
	}

	public void setConversionCost(BigDecimal conversionCost) {
		this.conversionCost = conversionCost;
	}

	public Integer getCapacity() {
		return capacity;
	}

	public void setCapacity(Integer capacity) {
		this.capacity = capacity;
	}

	public String getPackingType() {
		return packingType;
	}

	public void setPackingType(String packingType) {
		this.packingType = packingType;
	}

	public String getPrefix() {
		return prefix;
	}

	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}

	public String getBrandName() {
		return brandName;
	}

	public void setBrandName(String brandName) {
		this.brandName = brandName;
	}

	@Id
    @Column(name = "product_id", nullable = false, unique = true)
    private Integer productId;

    @Column(name = "product_name", length = 250)
    private String productName;

    @Column(name = "uom_id")
    private Integer uomId;

    @Column(name = "product_code")
    private Integer productCode;

    @Column(name = "fg_lot_code", length = 10)
    private String fgLotCode;

    @Column(name = "product_group_id")
    private Integer productGroupId;

   

    @Column(name = "rate", precision = 11, scale = 2)
    private BigDecimal rate;

    @Column(name = "test_id")
    private Integer testId;

    @Column(name = "conversion_cost", precision = 11, scale = 2)
    private BigDecimal conversionCost;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "packing_type", length = 250)
    private String packingType;

    @Column(name = "prefix", length = 250)
    private String prefix;

    @Column(name = "brand_name", length = 1000)
    private String brandName;

    // Getters & Setters
}