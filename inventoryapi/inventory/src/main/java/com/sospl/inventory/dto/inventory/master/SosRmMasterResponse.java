package com.sospl.inventory.dto.inventory.master;

import java.math.BigDecimal;

public class SosRmMasterResponse {

    private Long id;

    private Integer rmCode;
    private String rmName;

    private String uomName;
    private String rmGroupName;
    private String testName;

    private Integer exciseTariffNo;
    private Integer exciseDeclaredItem;

    private BigDecimal exciseRate;
    private BigDecimal eCessRate;
    private BigDecimal shECessRate;

    private BigDecimal avgRate;

    // ===============================
    // Getters & Setters
    // ===============================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getUomName() {
        return uomName;
    }

    public void setUomName(String uomName) {
        this.uomName = uomName;
    }

    public String getRmGroupName() {
        return rmGroupName;
    }

    public void setRmGroupName(String rmGroupName) {
        this.rmGroupName = rmGroupName;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public Integer getExciseTariffNo() {
        return exciseTariffNo;
    }

    public void setExciseTariffNo(Integer exciseTariffNo) {
        this.exciseTariffNo = exciseTariffNo;
    }

    public Integer getExciseDeclaredItem() {
        return exciseDeclaredItem;
    }

    public void setExciseDeclaredItem(Integer exciseDeclaredItem) {
        this.exciseDeclaredItem = exciseDeclaredItem;
    }

    public BigDecimal getExciseRate() {
        return exciseRate;
    }

    public void setExciseRate(BigDecimal exciseRate) {
        this.exciseRate = exciseRate;
    }

    public BigDecimal getECessRate() {
        return eCessRate;
    }

    public void setECessRate(BigDecimal eCessRate) {
        this.eCessRate = eCessRate;
    }

    public BigDecimal getShECessRate() {
        return shECessRate;
    }

    public void setShECessRate(BigDecimal shECessRate) {
        this.shECessRate = shECessRate;
    }

    public BigDecimal getAvgRate() {
        return avgRate;
    }

    public void setAvgRate(BigDecimal avgRate) {
        this.avgRate = avgRate;
    }
    
    public SosRmMasterResponse(
            Long id,
            Integer rmCode,
            String rmName,
            String uomName,
            String rmGroupName,
            String testName,
            Integer exciseTariffNo,
            Integer exciseDeclaredItem,
            BigDecimal exciseRate,
            BigDecimal shECessRate,
            BigDecimal avgRate
    ) {
        this.id = id;
        this.rmCode = rmCode;
        this.rmName = rmName;
        this.uomName = uomName;
        this.rmGroupName = rmGroupName;
        this.testName = testName;
        this.exciseTariffNo = exciseTariffNo;
        this.exciseDeclaredItem = exciseDeclaredItem;
        this.exciseRate = exciseRate;
        this.shECessRate = shECessRate;
        this.avgRate = avgRate;
    }

    
    
}