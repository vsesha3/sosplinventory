package com.sospl.inventory.repository;

import com.sospl.inventory.model.SosWorkOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
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
    	
    	@Query(value = """
    		       SELECT
    		           wo.wo_id                                AS woId,
    		           wo.wo_code                              AS woCode,
    		           wo.qty - COALESCE(SUM(pp.qty), 0)       AS remainingQty,
    		           wo.po_id                                AS poId,
    		           spmt.product_name                       AS productName,
    		           spmt.product_code                       AS productCode
    		       FROM sos_work_order_t wo
    		       INNER JOIN sos_purchase_order_t po
    		           ON wo.po_id = po.po_id
    		       LEFT JOIN sos_production_plan_t pp
    		           ON wo.wo_id = pp.wo_id
    		           AND pp.is_deleted = 0
    		       LEFT JOIN sos_product_master_t spmt
    		           ON wo.product_id = spmt.product_id
    		       WHERE
    		           :toDate < po.ord_delivery_date
    		           AND wo.is_deleted = 0
    		           AND wo.wo_id NOT IN (
    		               SELECT wo2.wo_id
    		               FROM sos_work_order_t wo2
    		               LEFT JOIN sos_production_plan_t pp2
    		                   ON wo2.wo_id = pp2.wo_id
    		               WHERE
    		                   pp2.production_from_date >= :fromDate
    		                   AND pp2.production_to_date <= :toDate
    		                   AND pp2.is_deleted = 0
    		               GROUP BY wo2.wo_id, wo2.qty
    		               HAVING wo2.qty - COALESCE(SUM(pp2.qty), 0) > 0
    		           )
    		       GROUP BY
    		           wo.wo_id,
    		           wo.wo_code,
    		           wo.qty,
    		           wo.po_id,
    		           po.ord_delivery_date,
    		           spmt.product_name,
    		           spmt.product_code
    		       HAVING
    		           wo.qty - COALESCE(SUM(pp.qty), 0) > 0
    		       ORDER BY
    		           wo.wo_id DESC
    		       """, nativeQuery = true)
    		List<Object[]> fetchWODropDownForDelivery(
    		        @Param("fromDate") LocalDate fromDate,
    		        @Param("toDate") LocalDate toDate);
    		
    		
}