package com.sospl.inventory.projection;

import java.math.BigDecimal;

public interface ProductionPlanCapacityProjection {

    Long getProductionPlanId();

    Long getProductId();

    String getProductName();

    String getProductCode();

    BigDecimal getRmProductionCapacity();

    BigDecimal getPmProductionCapacity();

    BigDecimal getProductProduced();
}