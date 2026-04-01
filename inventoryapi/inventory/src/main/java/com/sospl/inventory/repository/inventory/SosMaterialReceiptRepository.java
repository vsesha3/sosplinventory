package com.sospl.inventory.repository.inventory;

import com.sospl.inventory.model.SosMaterialReceipt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosMaterialReceiptRepository
        extends JpaRepository<SosMaterialReceipt, Long> {

    // ── Find all by material type ─────────────────────────────────────────
    List<SosMaterialReceipt> findAllByMaterialTypeAndIsDeletedFalse(
            String materialType);

    // ── Find all by material type paginated ───────────────────────────────
    Page<SosMaterialReceipt> findAllByMaterialTypeAndIsDeletedFalse(
            String materialType, Pageable pageable);

    // ── Find all active by material type ──────────────────────────────────
    List<SosMaterialReceipt> findAllByMaterialTypeAndIsActiveTrueAndIsDeletedFalse(
            String materialType);

    // ── Find by receipt id and material type ──────────────────────────────
    SosMaterialReceipt findByReceiptIdAndMaterialTypeAndIsDeletedFalse(
            Long receiptId, String materialType);

    // ── Find by po_ref_no and material type ───────────────────────────────
    List<SosMaterialReceipt> findAllByPoRefNoAndMaterialTypeAndIsDeletedFalse(
            Long poRefNo, String materialType);

    // ── Find by po_det_id ─────────────────────────────────────────────────
    List<SosMaterialReceipt> findAllByPoDetIdAndIsDeletedFalse(
            Long poDetId);

    // ── Search by material type and lot no ────────────────────────────────
    @Query("""
           SELECT r FROM SosMaterialReceipt r
           WHERE r.materialType = :materialType
           AND r.isDeleted = false
           AND (
               LOWER(r.lotNo) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(r.packType) LIKE LOWER(CONCAT('%', :keyword, '%'))
           )
           """)
    Page<SosMaterialReceipt> searchByMaterialType(
            @Param("materialType") String materialType,
            @Param("keyword") String keyword,
            Pageable pageable);

	Optional<SosMaterialReceipt> findByPoDetIdAndReceiptDetIdAndIsDeletedFalse(Long poDetId, Long receiptDetId);
}