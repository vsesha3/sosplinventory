package com.sospl.inventory.dto.inventory.master;

import java.math.BigDecimal;

public class SosCapitalGoodsMasterResponse {

    private Long cgId;
    private String cgCode;
    private String cgName;
    private Integer uomId;
    private String uomName;
    private BigDecimal avgRate;
    private Boolean isActive;

    // Constructor 1 — Long cgId, Integer uomId
    public SosCapitalGoodsMasterResponse(
            Long cgId,
            String cgCode,
            String cgName,
            Integer uomId,
            String uomName,
            BigDecimal avgRate,
            Boolean isActive
    ) {
        this.cgId = cgId;
        this.cgCode = cgCode != null ? cgCode : "-";
        this.cgName = cgName != null ? cgName : "-";
        this.uomId = uomId;
        this.uomName = uomName != null ? uomName : "-";
        this.avgRate = avgRate;
        this.isActive = isActive;
    }

    // Constructor 2 — Long cgId, Long uomId
    public SosCapitalGoodsMasterResponse(
            Long cgId,
            String cgCode,
            String cgName,
            Long uomId,
            String uomName,
            BigDecimal avgRate,
            Boolean isActive
    ) {
        this.cgId = cgId;
        this.cgCode = cgCode != null ? cgCode : "-";
        this.cgName = cgName != null ? cgName : "-";
        this.uomId = uomId != null ? uomId.intValue() : null;
        this.uomName = uomName != null ? uomName : "-";
        this.avgRate = avgRate;
        this.isActive = isActive;
    }

    // Constructor 3 — Integer cgId, Integer uomId
    public SosCapitalGoodsMasterResponse(
            Integer cgId,
            String cgCode,
            String cgName,
            Integer uomId,
            String uomName,
            BigDecimal avgRate,
            Boolean isActive
    ) {
        this.cgId = cgId != null ? cgId.longValue() : null;
        this.cgCode = cgCode != null ? cgCode : "-";
        this.cgName = cgName != null ? cgName : "-";
        this.uomId = uomId;
        this.uomName = uomName != null ? uomName : "-";
        this.avgRate = avgRate;
        this.isActive = isActive;
    }

    // Constructor 4 — Integer cgId, Long uomId
    public SosCapitalGoodsMasterResponse(
            Integer cgId,
            String cgCode,
            String cgName,
            Long uomId,
            String uomName,
            BigDecimal avgRate,
            Boolean isActive
    ) {
        this.cgId = cgId != null ? cgId.longValue() : null;
        this.cgCode = cgCode != null ? cgCode : "-";
        this.cgName = cgName != null ? cgName : "-";
        this.uomId = uomId != null ? uomId.intValue() : null;
        this.uomName = uomName != null ? uomName : "-";
        this.avgRate = avgRate;
        this.isActive = isActive;
    }

    public Long getCgId() { return cgId; }
    public void setCgId(Long cgId) { this.cgId = cgId; }

    public String getCgCode() { return cgCode; }
    public void setCgCode(String cgCode) { this.cgCode = cgCode; }

    public String getCgName() { return cgName; }
    public void setCgName(String cgName) { this.cgName = cgName; }

    public Integer getUomId() { return uomId; }
    public void setUomId(Integer uomId) { this.uomId = uomId; }

    public String getUomName() { return uomName; }
    public void setUomName(String uomName) { this.uomName = uomName; }

    public BigDecimal getAvgRate() { return avgRate; }
    public void setAvgRate(BigDecimal avgRate) { this.avgRate = avgRate; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}