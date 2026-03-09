package com.sospl.inventory.dto.inventory.master;

import java.math.BigDecimal;

public class SosProductMasterResponse {

    private Integer productId;
    private Integer productCode;
    private String productName;
    private String uomName;
    private Integer productGroupId;
    private String testName;
    private BigDecimal rate;

    // Constructor for JPQL
    public SosProductMasterResponse(
            Integer productId,
            Integer productCode,
            String productName,
            String uomName,
            Integer productGroupId,
            String testName,
            BigDecimal rate
    ) {
        this.productId = productId;
        this.productCode = productCode;
        this.productName = productName;
        this.uomName = uomName;
        this.productGroupId = productGroupId;
        this.testName = testName;
        this.rate = rate;
    }

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public Integer getProductCode() { return productCode; }
    public void setProductCode(Integer productCode) { this.productCode = productCode; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getUomName() { return uomName; }
    public void setUomName(String uomName) { this.uomName = uomName; }

    public Integer getProductGroupId() { return productGroupId; }
    public void setProductGroupId(Integer productGroupId) { this.productGroupId = productGroupId; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public BigDecimal getRate() { return rate; }
    public void setRate(BigDecimal rate) { this.rate = rate; }
}