package com.sospl.inventory.dto.inventory.master;

import java.math.BigDecimal;

public class SosRmMasterResponse {

    private Integer id;

    private Integer rmCode;
    private String rmName;

    private String uomName;
    private String rmGroupName;
    private String testName;

    private BigDecimal avgRate;

    // ===============================
    // Getters & Setters
    // ===============================

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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

    public BigDecimal getAvgRate() {
        return avgRate;
    }

    public void setAvgRate(BigDecimal avgRate) {
        this.avgRate = avgRate;
    }
    
    public SosRmMasterResponse(
            Integer id,
            Integer rmCode,
            String rmName,
            String uomName,
            String rmGroupName,
            String testName,
            BigDecimal avgRate
    ) {
        this.id = id;
        this.rmCode = rmCode;
        this.rmName = rmName;
        this.uomName = uomName;
        this.rmGroupName = rmGroupName;
        this.testName = testName;
        this.avgRate = avgRate;
    }

    
    
}