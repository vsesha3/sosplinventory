package com.sospl.inventory.repository;

import com.sospl.inventory.model.SosWorkOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosWorkOrderRepository
        extends JpaRepository<SosWorkOrder, Long> {

    // ── Find all active ───────────────────────────────────────────────────
    List<SosWorkOrder> findAllByIsActiveTrueAndIsDeletedFalse();

    // ── Find all active paginated ─────────────────────────────────────────
    Page<SosWorkOrder> findAllByIsActiveTrueAndIsDeletedFalse(
            Pageable pageable);

    // ── Find by po_id ─────────────────────────────────────────────────────
    List<SosWorkOrder> findAllByPoIdAndIsDeletedFalse(Long poId);

    // ── Find by product_id ────────────────────────────────────────────────
    List<SosWorkOrder> findAllByProductIdAndIsDeletedFalse(Long productId);

    // ── Find by pm_id ─────────────────────────────────────────────────────
    List<SosWorkOrder> findAllByPmIdAndIsDeletedFalse(Long pmId);

    // ── Find by wo_code ───────────────────────────────────────────────────
    Optional<SosWorkOrder> findByWoCodeAndIsDeletedFalse(String woCode);

    // ── Find by plant ─────────────────────────────────────────────────────
    List<SosWorkOrder> findAllByPlantAndIsDeletedFalse(String plant);

    // ── Search ────────────────────────────────────────────────────────────
    @Query("""
           SELECT w FROM SosWorkOrder w
           WHERE w.isDeleted = false
           AND (
               LOWER(w.woCode)   LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(w.plant) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(w.lineItem) LIKE LOWER(CONCAT('%', :keyword, '%'))
           )
           """)
    Page<SosWorkOrder> search(
            @Param("keyword") String keyword,
            Pageable pageable);

    // ── Dropdown ──────────────────────────────────────────────────────────
    @Query("""
           SELECT w FROM SosWorkOrder w
           WHERE w.isActive = true
           AND w.isDeleted = false
           ORDER BY w.woCode ASC
           """)
    List<SosWorkOrder> findAllForDropdown();
    
    @Query(value = """
    	       SELECT
    	           swot.wo_id           AS woId,
    	           swot.po_id           AS poId,
    	           swot.plant           AS plant,
    	           spmt.product_id      AS productId,
    	           swot.qty             AS qty,
    	           swot.per_unit_rate   AS perUnitRate,
    	           sspmt.pm_id          AS pmId,
    	           spmt.product_code    AS productCode,
    	           spmt.product_name    AS productName,
    	           sspmt.pm_name        AS pmName
    	       FROM sos_work_order_t swot
    	       LEFT JOIN sos_product_master_t spmt
    	           ON swot.product_id = spmt.product_id
    	       LEFT JOIN sos_pm_master_t sspmt
    	           ON swot.pm_id = sspmt.pm_id
    	       WHERE swot.is_deleted = 0
    	       AND swot.po_id = :poId
    	       """, nativeQuery = true)
    	List<Object[]> findAllWorkOrdersWithDetailsByPoId(
    	        @Param("poId") Long poId);
}