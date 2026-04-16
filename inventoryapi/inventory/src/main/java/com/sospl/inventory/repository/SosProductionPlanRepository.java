package com.sospl.inventory.repository;

import com.sospl.inventory.model.SosProductionPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SosProductionPlanRepository
        extends JpaRepository<SosProductionPlan, Long> {

    // ── Find all active ───────────────────────────────────────────────────
    List<SosProductionPlan> findAllByIsActiveTrueAndIsDeletedFalse();

    // ── Find all active paginated ─────────────────────────────────────────
    Page<SosProductionPlan> findAllByIsActiveTrueAndIsDeletedFalse(
            Pageable pageable);

    // ── Find by wo_id ─────────────────────────────────────────────────────
    List<SosProductionPlan> findAllByWoIdAndIsDeletedFalse(Long woId);

    // ── Find by vessel_id ─────────────────────────────────────────────────
    List<SosProductionPlan> findAllByVesselIdAndIsDeletedFalse(
            Long vesselId);

    // ── Find by coa_reference ─────────────────────────────────────────────
    List<SosProductionPlan> findAllByCoaReferenceAndIsDeletedFalse(
            String coaReference);

    // ── Find by date range ────────────────────────────────────────────────
    @Query("""
           SELECT p FROM SosProductionPlan p
           WHERE p.isDeleted = false
           AND p.productionFromDate >= :fromDate
           AND p.productionToDate <= :toDate
           """)
    List<SosProductionPlan> findByDateRange(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate);

    // ── Find by shift ─────────────────────────────────────────────────────
    List<SosProductionPlan> findAllByProductionFromShiftAndIsDeletedFalse(
            String productionFromShift);

    // ── Search ────────────────────────────────────────────────────────────
    @Query("""
           SELECT p FROM SosProductionPlan p
           WHERE p.isDeleted = false
           AND (
               LOWER(p.coaReference) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(p.productionFromShift) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(p.productionToShift) LIKE LOWER(CONCAT('%', :keyword, '%'))
           )
           """)
    Page<SosProductionPlan> search(
            @Param("keyword") String keyword,
            Pageable pageable);
    
    
 // ── Find all production plans ─────────────────────────────────────────────
    @Query(value = """
           SELECT
               pp.production_plan_id                    AS productionPlanId,
               pp.qty                                   AS qty,
               wo.wo_id                                 AS woId,
               wo.wo_code                               AS woCode,
               pp.production_from_date                  AS fromDate,
               pp.production_to_date                    AS toDate,
               pm.pm_id                                 AS pmId,
               pm.pm_name                               AS pmName,
               pm.pm_size                               AS pmSize,
               po.company_id                            AS companyId,
               cm.company_name                          AS companyName,
               CEIL(pp.qty / NULLIF(pm.pm_size, 0))     AS pmReq,
               pp.created_at                            AS createdOn
           FROM sos_production_plan_t pp
           LEFT JOIN sos_work_order_t wo
               ON pp.wo_id = wo.wo_id
           LEFT JOIN sos_pm_master_t pm
               ON pm.pm_id = wo.pm_id
           LEFT JOIN sos_purchase_order_t po
               ON po.po_id = wo.po_id
           LEFT JOIN sos_company_master_t cm
               ON cm.company_id = po.company_id
           WHERE pp.is_deleted = 0
           ORDER BY pp.production_to_date DESC, wo.wo_id DESC
           """, nativeQuery = true)
    List<Object[]> findCurrentAndFuturePlans();

    // ── Find by wo_id ─────────────────────────────────────────────────────────
    @Query(value = """
           SELECT
               pp.production_plan_id                    AS productionPlanId,
               pp.qty                                   AS qty,
               wo.wo_id                                 AS woId,
               wo.wo_code                               AS woCode,
               pp.production_from_date                  AS fromDate,
               pp.production_to_date                    AS toDate,
               pm.pm_id                                 AS pmId,
               pm.pm_name                               AS pmName,
               pm.pm_size                               AS pmSize,
               po.company_id                            AS companyId,
               cm.company_name                          AS companyName,
               CEIL(pp.qty / NULLIF(pm.pm_size, 0))     AS pmReq,
               pp.created_at                            AS createdOn
           FROM sos_production_plan_t pp
           LEFT JOIN sos_work_order_t wo
               ON pp.wo_id = wo.wo_id
           LEFT JOIN sos_pm_master_t pm
               ON pm.pm_id = wo.pm_id
           LEFT JOIN sos_purchase_order_t po
               ON po.po_id = wo.po_id
           LEFT JOIN sos_company_master_t cm
               ON cm.company_id = po.company_id
           WHERE pp.is_deleted = 0
           AND pp.wo_id = :woId
           ORDER BY pp.production_to_date DESC, wo.wo_id DESC
           """, nativeQuery = true)
    List<Object[]> findCurrentAndFuturePlansByWoId(
            @Param("woId") Long woId);
    
    @Query(value = """
    	       SELECT
    	           sppt.production_plan_id     AS productionPlanId,
    	           sppt.production_from_date   AS productionFromDate,
    	           sppt.production_to_date     AS productionToDate,
    	           swot.wo_code                AS woCode,
    	           svmt.vessel_name            AS vesselName,
    	           sppt.qty                    AS qty,
    	           swot.wo_id                  AS woId,
    	           swot.po_id                  AS poId,
    	           swot.plant                  AS plant,
    	           spmt.product_name           AS productName,
    	           swot.qty                    AS woQty,
    	           swot.per_unit_rate          AS perUnitRate
    	       FROM sos_production_plan_t sppt
    	       LEFT JOIN sos_work_order_t swot
    	           ON sppt.wo_id = swot.wo_id
    	       LEFT JOIN sos_vessel_master_t svmt
    	           ON sppt.vessel_id = svmt.vessel_id
    	       LEFT JOIN sos_product_master_t spmt
    	           ON swot.product_id = spmt.product_id
    	       WHERE sppt.is_deleted = 0
    	       ORDER BY sppt.production_plan_id DESC
    	       """,
    	       countQuery = """
    	       SELECT COUNT(*)
    	       FROM sos_production_plan_t sppt
    	       WHERE sppt.is_deleted = 0
    	       """,
    	       nativeQuery = true)
    	Page<Object[]> findAllProductionPlanSummary(Pageable pageable);
}