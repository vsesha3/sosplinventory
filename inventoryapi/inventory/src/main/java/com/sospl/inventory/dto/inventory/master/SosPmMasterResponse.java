package com.sospl.inventory.dto.inventory.master;

import java.math.BigDecimal;

public class SosPmMasterResponse {

    private Integer pmId;
    private Integer pmCode;
    private String pmName;
    private Integer pmSize;
    private String fgLotCode;
    private String pmGroupName;
    private Integer pmGroupId;
    private BigDecimal avgRate;
    private String uomName;

    public SosPmMasterResponse(
            Integer pmId,
            Integer pmCode,
            String pmName,
            Integer pmSize,
            String fgLotCode,
            String pmGroupName,
            Integer pmGroupId,
            BigDecimal avgRate,
            String uomName
    ) {
        this.pmId = pmId;
        this.pmCode = pmCode;
        this.pmName = pmName;
        this.pmSize = pmSize;
        this.fgLotCode = fgLotCode != null ? fgLotCode : "-";
        this.pmGroupName = pmGroupName != null ? pmGroupName : "-";
        this.pmGroupId = pmGroupId;
        this.avgRate = avgRate;
        this.uomName = uomName != null ? uomName : "-";
    }

    public Integer getPmId() { return pmId; }
    public void setPmId(Integer pmId) { this.pmId = pmId; }

    public Integer getPmCode() { return pmCode; }
    public void setPmCode(Integer pmCode) { this.pmCode = pmCode; }

    public String getPmName() { return pmName != null ? pmName : "-"; }
    public void setPmName(String pmName) { this.pmName = pmName; }

    public Integer getPmSize() { return pmSize; }
    public void setPmSize(Integer pmSize) { this.pmSize = pmSize; }

    public String getFgLotCode() { return fgLotCode; }
    public void setFgLotCode(String fgLotCode) { this.fgLotCode = fgLotCode; }

    public String getPmGroupName() { return pmGroupName; }
    public void setPmGroupName(String pmGroupName) { this.pmGroupName = pmGroupName; }

    public Integer getPmGroupId() { return pmGroupId; }
    public void setPmGroupId(Integer pmGroupId) { this.pmGroupId = pmGroupId; }

    public BigDecimal getAvgRate() { return avgRate; }
    public void setAvgRate(BigDecimal avgRate) { this.avgRate = avgRate; }

    public String getUomName() { return uomName; }
    public void setUomName(String uomName) { this.uomName = uomName; }
}