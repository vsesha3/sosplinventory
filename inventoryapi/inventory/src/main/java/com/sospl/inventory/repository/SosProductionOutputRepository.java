
package com.sospl.inventory.repository;

import com.sospl.inventory.model.SosProductionOutput;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface SosProductionOutputRepository
        extends JpaRepository<SosProductionOutput, Long> {

    // Fetch production entries chronologically
    List<SosProductionOutput>
    findAllByProductionPlanIdAndIsActiveTrueAndIsDeletedFalseOrderByProductionDateAsc(
            Long productionPlanId
    );

    // Calculate total produced quantity for a production plan
    @Query("""
        SELECT COALESCE(SUM(p.producedQty), 0)
        FROM SosProductionOutput p
        WHERE p.productionPlanId = :productionPlanId
          AND p.isActive = true
          AND p.isDeleted = false
        """)
    BigDecimal getTotalProducedQty(
            @Param("productionPlanId") Long productionPlanId
    );

    // Fetch production entries by material request production lot
    List<SosProductionOutput>
    findAllByProductionLotNoAndIsActiveTrueAndIsDeletedFalseOrderByProductionDateAsc(
            String productionLotNo
    );

    // Fetch a specific finished goods lot
    @Query("""
        SELECT p
        FROM SosProductionOutput p
        WHERE p.fgLotNo = :fgLotNo
          AND p.isDeleted = false
        """)
    SosProductionOutput findByFgLotNo(
            @Param("fgLotNo") String fgLotNo
    );
}
