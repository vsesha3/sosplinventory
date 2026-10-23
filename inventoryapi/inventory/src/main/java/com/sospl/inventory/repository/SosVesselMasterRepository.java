package com.sospl.inventory.repository;

import com.sospl.inventory.model.SosVesselMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface SosVesselMasterRepository
        extends JpaRepository<SosVesselMaster, Long> {

    List<SosVesselMaster> findAllByIsActiveTrueAndIsDeletedFalse();
    
    @Query(value = """
    	    SELECT
    spmt.product_name AS productName,
    spmt.product_id,
    smmt.misc_name AS vesselName,
    sppt.production_plan_id AS productionPlan
FROM sos_work_order_t swot
LEFT JOIN sos_product_master_t spmt
    ON swot.product_id = spmt.product_id
LEFT JOIN sos_production_plan_t sppt
    ON sppt.production_plan_id = (
        SELECT MAX(sppt2.production_plan_id)
        FROM sos_production_plan_t sppt2
        WHERE sppt2.wo_id = swot.wo_id
          AND sppt2.is_active = 1
          AND sppt2.is_deleted = 0
    )
LEFT JOIN sos_misc_master_t smmt
    ON sppt.vessel_id = smmt.misc_id
WHERE swot.wo_id = :planId;
    	    """, nativeQuery = true)
    	List<Map<String, Object>> findWoDetailsByWoId(
    	        @Param("planId") Long planId);
    
    
    @Query(value = """
    	    SELECT fn_generate_lot_number(:woId, :rmReqId)
    	    """, nativeQuery = true)
    	String findLotNumberByWoId(
    	        @Param("woId") Long woId,
    	        @Param("rmReqId") Long rmReqId
    	);
}