package com.sospl.inventory.repository.master;

import com.sospl.inventory.model.master.SosProdMasterRmDetls;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface SosProdMasterRmDetlsRepository
        extends JpaRepository<SosProdMasterRmDetls, Long> {

    // ── Find all active ───────────────────────────────────────────────────
    List<SosProdMasterRmDetls> findAllByIsActiveTrueAndIsDeletedFalse();

    // ── Find by product_id ────────────────────────────────────────────────
    List<SosProdMasterRmDetls> findAllByProductIdAndIsDeletedFalse(
            Long productId);

    // ── Find by rm_id ─────────────────────────────────────────────────────
    List<SosProdMasterRmDetls> findAllByRmIdAndIsDeletedFalse(
            Long rmId);

    // ── Fetch RM details for WO ID with required qty calculation ──────────
    @Query(value = """
           SELECT
               swot.wo_id                              AS woId,
               swot.wo_code                            AS woCode,
               swot.product_id                         AS productId,
               srmt.rm_id                              AS rmId,
               srmt.rm_code                            AS rmCode,
               srmt.rm_name                            AS rmName,
               spmrd.mixpercentage                     AS mixPercentage,
               :qty                                    AS planQty,
               (:qty * spmrd.mixpercentage / 100)      AS requiredQty
           FROM sos_work_order_t swot
           LEFT JOIN sos_prod_master_rm_detls_t spmrd
               ON swot.product_id = spmrd.product_id
           LEFT JOIN sos_rm_master_t srmt
               ON spmrd.rm_id = srmt.rm_id
           WHERE swot.wo_id = :woId
           AND swot.is_deleted = 0
           AND spmrd.is_deleted = 0
           ORDER BY srmt.rm_name ASC
           """, nativeQuery = true)
    List<Object[]> fetchRMdetailsForWOID(
            @Param("woId") Long woId,
            @Param("qty") BigDecimal qty);
}