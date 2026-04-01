package com.sospl.inventory.repository;

import com.sospl.inventory.model.SosMaterialReceipt;
import com.sospl.inventory.model.SosMaterialReceiptDet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosMaterialReceiptDetRepository
        extends JpaRepository<SosMaterialReceiptDet, Long> {

    // ── Find all by material type ─────────────────────────────────────────
    List<SosMaterialReceiptDet> findAllByMaterialTypeAndIsDeletedFalse(
            String materialType);

    // ── Find all by material type paginated ───────────────────────────────
    Page<SosMaterialReceiptDet> findAllByMaterialTypeAndIsDeletedFalse(
            String materialType, Pageable pageable);

    // ── Find all active by material type ──────────────────────────────────
    List<SosMaterialReceiptDet> findAllByMaterialTypeAndIsActiveTrueAndIsDeletedFalse(
            String materialType);

    // ── Find by id and material type ──────────────────────────────────────
    Optional<SosMaterialReceiptDet> findByReceiptDetIdAndMaterialTypeAndIsDeletedFalse(
            Long receiptDetId, String materialType);

    // ── Find by supplier and material type ────────────────────────────────
    List<SosMaterialReceiptDet> findAllBySupplierIdAndMaterialTypeAndIsDeletedFalse(
            Long supplierId, String materialType);

    // ── Find by grn no ────────────────────────────────────────────────────
    Optional<SosMaterialReceiptDet> findByGrnNoAndIsDeletedFalse(
            String grnNo);

    // ── Search by material type ───────────────────────────────────────────
    @Query("""
           SELECT r FROM SosMaterialReceiptDet r
           WHERE r.materialType = :materialType
           AND r.isDeleted = false
           AND (
               LOWER(r.invoiceNo)   LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(r.grnNo)    LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(r.ircNo)    LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(r.lrNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))
           )
           """)
    Page<SosMaterialReceiptDet> searchByMaterialType(
            @Param("materialType") String materialType,
            @Param("keyword") String keyword,
            Pageable pageable);

    // ── Find by supplier paginated ────────────────────────────────────────
    @Query("""
           SELECT r FROM SosMaterialReceiptDet r
           WHERE r.materialType = :materialType
           AND r.supplierId = :supplierId
           AND r.isDeleted = false
           ORDER BY r.receiptDateTime DESC
           """)
    Page<SosMaterialReceiptDet> findBySupplierAndMaterialType(
            @Param("materialType") String materialType,
            @Param("supplierId") Long supplierId,
            Pageable pageable);
    
 // Find by po_ref_no
    Optional<SosMaterialReceiptDet> findByPoRefNoAndIsDeletedFalse(
            Long poRefNo);
    
    
    
}