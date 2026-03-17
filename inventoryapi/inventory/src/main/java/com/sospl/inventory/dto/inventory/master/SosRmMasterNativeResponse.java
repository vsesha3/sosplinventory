package com.sospl.inventory.dto.inventory.master;

import java.math.BigDecimal;

public interface SosRmMasterNativeResponse {

    Integer getRmId();
    Long getRmCode();
    String getRmName();
    Long getUomId();
    String getUomName();
    Long getPackUom();
    String getPackUomName();
    BigDecimal getAvgRate();
    BigDecimal getPackSize();
}