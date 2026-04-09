package com.sospl.inventory.repository.master;

import com.sospl.inventory.model.master.SosProdMasterPmDetls;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SosProdMasterPmDetlsRepository
        extends JpaRepository<SosProdMasterPmDetls, Long> {

    // Find by product_id
    List<SosProdMasterPmDetls> findAllByProductIdAndIsDeletedFalse(
            Long productId);

    // Find by pm_id
    List<SosProdMasterPmDetls> findAllByPmIdAndIsDeletedFalse(
            Long pmId);

    // Find by product_id and pm_id
    List<SosProdMasterPmDetls> findAllByProductIdAndPmIdAndIsDeletedFalse(
            Long productId, Long pmId);

    // Find all active
    List<SosProdMasterPmDetls> findAllByIsActiveTrueAndIsDeletedFalse();
    
    
    @Query(value = """
    	       SELECT
    	           spmpt.product_id    AS productId,
    	           spmt.pm_id          AS pmId,
    	           spmt.pm_name        AS pmName
    	       FROM sos_prod_master_pm_detls_t spmpt
    	       LEFT JOIN sos_pm_master_t spmt
    	           ON spmpt.pm_id = spmt.pm_id
    	       WHERE spmpt.is_deleted = 0
    	       """, nativeQuery = true)
    	List<Object[]> findAllWithPmDetails();

    	// ── Filter by product_id ──────────────────────────────────────────────────
    	@Query(value = """
    	       SELECT
    	           spmpt.product_id    AS productId,
    	           spmt.pm_id          AS pmId,
    	           spmt.pm_name        AS pmName
    	       FROM sos_prod_master_pm_detls_t spmpt
    	       LEFT JOIN sos_pm_master_t spmt
    	           ON spmpt.pm_id = spmt.pm_id
    	       WHERE spmpt.is_deleted = 0
    	       AND spmpt.product_id = :productId
    	       """, nativeQuery = true)
    	List<Object[]> findAllWithPmDetailsByProductId(
    	        @Param("productId") Long productId);
}