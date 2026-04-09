package com.sospl.inventory.repository;

import com.sospl.inventory.model.SosPurchaseOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosPurchaseOrderRepository
        extends JpaRepository<SosPurchaseOrder, Long> {

    // ── Find all active ───────────────────────────────────────────────────
    List<SosPurchaseOrder> findAllByIsActiveTrueAndIsDeletedFalse();

    // ── Find all active paginated ─────────────────────────────────────────
    Page<SosPurchaseOrder> findAllByIsActiveTrueAndIsDeletedFalse(
            Pageable pageable);

    // ── Find by po_number ─────────────────────────────────────────────────
    Optional<SosPurchaseOrder> findByPoNumberAndIsDeletedFalse(
            String poNumber);

    // ── Find by company_id ────────────────────────────────────────────────
    List<SosPurchaseOrder> findAllByCompanyIdAndIsDeletedFalse(
            Long companyId);

    // ── Find by partial_po_flag ───────────────────────────────────────────
    List<SosPurchaseOrder> findAllByPartialPoFlagAndIsDeletedFalse(
            Boolean partialPoFlag);

    // ── Search ────────────────────────────────────────────────────────────
    @Query("""
           SELECT p FROM SosPurchaseOrder p
           WHERE p.isDeleted = false
           AND (
               LOWER(p.poNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))
           )
           """)
    Page<SosPurchaseOrder> search(
            @Param("keyword") String keyword,
            Pageable pageable);

    // ── Dropdown ──────────────────────────────────────────────────────────
    @Query("""
           SELECT p FROM SosPurchaseOrder p
           WHERE p.isActive = true
           AND p.isDeleted = false
           ORDER BY p.poNumber ASC
           """)
    List<SosPurchaseOrder> findAllForDropdown();
}