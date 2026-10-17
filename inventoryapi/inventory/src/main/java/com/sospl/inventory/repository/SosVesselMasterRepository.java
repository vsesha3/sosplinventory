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
    	        smmt.misc_name AS vesselName
    	    FROM sos_work_order_t swot
    	    LEFT JOIN sos_product_master_t spmt
    	        ON swot.product_id = spmt.product_id
    	    LEFT JOIN sos_production_plan_t sppt
    	        ON swot.po_id = sppt.production_plan_id
    	    LEFT JOIN sos_misc_master_t smmt
    	        ON sppt.vessel_id = smmt.misc_id
    	    WHERE swot.wo_id = :planId
    	    """, nativeQuery = true)
    	List<Map<String, Object>> findWoDetailsByWoId(
    	        @Param("planId") Long planId);
    
    
    @Query(value = """
    	    SELECT
    	        COALESCE(
    	            (
    	                SELECT NULLIF(TRIM(srrt.production_lot_number), '')
    	                FROM sos_rm_request_t srrt
    	                WHERE srrt.wo_id = swot.wo_id
    	                  AND srrt.is_active = 1
    	            ),
    	            CONCAT(
    	                COALESCE(TRIM(spmt.fg_lot_code), ''),
    	                '001',
    	                COALESCE(TRIM(smmt.misc_name), ''),
    	                DATE_FORMAT(sppt.production_from_date, '%y'),
    	                COALESCE(TRIM(srmt.rm_code), '')
    	            )
    	        ) AS generatedLotNumber
    	    FROM sos_work_order_t swot
    	    INNER JOIN sos_product_master_t spmt
    	        ON swot.product_id = spmt.product_id
    	       AND spmt.is_active = 1
    	    INNER JOIN sos_production_plan_t sppt
    	        ON swot.wo_id = sppt.wo_id
    	       AND sppt.is_active = 1
    	    INNER JOIN sos_purchase_order_t spot
    	        ON swot.po_id = spot.po_id
    	       AND spot.is_active = 1
    	    INNER JOIN sos_misc_master_t smmt
    	        ON spot.company_id = smmt.misc_id
    	       AND smmt.is_active = 1
    	    INNER JOIN sos_prod_master_pm_detls_t spmpd
    	        ON spmt.product_id = spmpd.product_id
    	       AND spmpd.is_active = 1
    	    INNER JOIN sos_rm_master_t srmt
    	        ON spmpd.pm_id = srmt.rm_id
    	       AND srmt.is_active = 1
    	    WHERE swot.wo_id = :woId
    	      AND swot.is_active = 1
    	    LIMIT 1
    	    """, nativeQuery = true)
    	String findLotNumberByWoId(@Param("woId") Long woId);
}