// File 1 — SosRmRequestRepository.java
package com.sospl.inventory.repository.rmrequest;

import com.sospl.inventory.model.rmrequest.SosRmRequest;


import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SosRmRequestRepository
        extends JpaRepository<SosRmRequest, Long> {

    // Find by wo_id
    List<SosRmRequest> findAllByWoIdAndIsDeletedFalse(Long woId);

    // Find by production_plan_id
    List<SosRmRequest> findAllByProductionPlanIdAndIsDeletedFalse(
            Long productionPlanId);

    // Find by is_rm_issue_completed
    List<SosRmRequest> findAllByIsRmIssueCompletedAndIsDeletedFalse(
            Boolean isRmIssueCompleted);

    // Find all active
    List<SosRmRequest> findAllByIsActiveTrueAndIsDeletedFalse();
    
    
    @Query(value = """
    	       SELECT
    	           rr.rm_req_id                    AS rmReqId,
    	           rr.rm_req_date                  AS rmReqDate,
    	           rr.wo_id                        AS woId,
    	           wo.wo_code                      AS woCode,
    	           rr.created_by                   AS createdBy,
    	           rr.created_at                   AS createdOn,
    	           rr.updated_by                   AS lastUpdatedBy,
    	           rr.updated_at                   AS lastUpdatedOn,
    	           rr.is_active                    AS isActive,
    	           emp.emp_name                    AS requestBy,
    	           rr.schedule_date                AS scheduleDate,
    	           rr.plan_to_prod_qty             AS planToProdQty,
    	           rr.production_lot_number        AS productionLotNumber,
    	           rr.is_rm_issue_completed        AS isRmIssueCompleted,
    	           po.company_id                   AS companyId,
    	           rr.gin_no                       AS ginNo,
    	           spmt.product_code               AS productCode,
    	           spmt.product_name               AS productName
    	       FROM sos_rm_request_t rr
    	       LEFT JOIN sos_work_order_t wo
    	           ON rr.wo_id = wo.wo_id
    	       LEFT JOIN sos_employee_profile_t emp
    	           ON rr.request_by = emp.emp_id
    	       LEFT JOIN sos_purchase_order_t po
    	           ON po.po_id = wo.po_id
    	       LEFT JOIN sos_product_master_t spmt
    	           ON wo.product_id = spmt.product_id
    	       WHERE rr.is_deleted = 0
    	       AND po.is_active = 1
    	       AND wo.is_active = 1
    	       ORDER BY rr.rm_req_id DESC
    	       """,
    	       countQuery = """
    	       SELECT COUNT(*)
    	       FROM sos_rm_request_t rr
    	       LEFT JOIN sos_work_order_t wo
    	           ON rr.wo_id = wo.wo_id
    	       LEFT JOIN sos_purchase_order_t po
    	           ON po.po_id = wo.po_id
    	       WHERE rr.is_deleted = 0
    	       AND po.is_active = 1
    	       AND wo.is_active = 1
    	       """,
    	       nativeQuery = true)
    	Page<Object[]> findAllRmRequestView(Pageable pageable);
    	
    	@Query(value = """
    		       SELECT COALESCE(MAX(CAST(gin_no AS UNSIGNED)), 0) + 1
    		       FROM sos_rm_request_t
    		       WHERE is_deleted = 0
    		       """, nativeQuery = true)
    		Long getNextGinNo();
}