package com.sospl.inventory.repository;

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

    // ── Find by po_ref_no — single ────────────────────────────────────────
    Optional<SosMaterialReceiptDet> findByPoRefNoAndIsDeletedFalse(
            Long poRefNo);

    // ── Find all by po_ref_no — list ─────────────────────────────────────
    List<SosMaterialReceiptDet> findAllByPoRefNoAndIsDeletedFalse(
            Long poRefNo);

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

    // ── Summary queries ───────────────────────────────────────────────────
    @Query(value = """
           SELECT
               smrd.receipt_det_id                              AS receiptDetId,
               sport.po_ref_no                                  AS poRefNo,
               smrd.material_type                               AS materialType,
               smrd.invoice_no                                  AS invoiceNo,
               smrd.supplier_id                                 AS supplierId,
               smrd.invoice_date                                AS invoiceDate,
               SUM(sport.sgst_value)                            AS sgstValue,
               SUM(sport.cgst_value)                            AS cgstValue,
               SUM(sport.igst_value)                            AS igstValue,
               SUM(smrt.no_of_received)                         AS noOfReceived,
               SUM(smrt.no_of_received * smrt.per_unit_rate)    AS netAmount,
               SUM(sport.sgst_value) + SUM(sport.cgst_value)
                   + SUM(sport.igst_value)
                   + SUM(smrt.no_of_received * smrt.per_unit_rate)
                                                                AS totalAmount
           FROM sos_material_receipt_det_t smrd
           LEFT JOIN sos_material_receipt_t smrt
               ON smrd.receipt_det_id = smrt.receipt_det_id
           LEFT JOIN sos_po_details_t sport
               ON smrt.po_det_id = sport.po_det_id
           WHERE smrd.is_deleted = 0
           GROUP BY
               smrd.receipt_det_id,
               sport.po_ref_no,
               smrd.material_type,
               smrd.invoice_no,
               smrd.supplier_id,
               smrd.invoice_date
           """, nativeQuery = true)
    List<Object[]> findAllReceiptSummary();

    @Query(value = """
           SELECT
               smrd.receipt_det_id                              AS receiptDetId,
               sport.po_ref_no                                  AS poRefNo,
               smrd.material_type                               AS materialType,
               smrd.invoice_no                                  AS invoiceNo,
               smrd.supplier_id                                 AS supplierId,
               smrd.invoice_date                                AS invoiceDate,
               SUM(sport.sgst_value)                            AS sgstValue,
               SUM(sport.cgst_value)                            AS cgstValue,
               SUM(sport.igst_value)                            AS igstValue,
               SUM(smrt.no_of_received)                         AS noOfReceived,
               SUM(smrt.no_of_received * smrt.per_unit_rate)    AS netAmount,
               SUM(sport.sgst_value) + SUM(sport.cgst_value)
                   + SUM(sport.igst_value)
                   + SUM(smrt.no_of_received * smrt.per_unit_rate)
                                                                AS totalAmount
           FROM sos_material_receipt_det_t smrd
           LEFT JOIN sos_material_receipt_t smrt
               ON smrd.receipt_det_id = smrt.receipt_det_id
           LEFT JOIN sos_po_details_t sport
               ON smrt.po_det_id = sport.po_det_id
           WHERE smrd.is_deleted = 0
           AND smrd.po_ref_no = :poRefNo
           GROUP BY
               smrd.receipt_det_id,
               sport.po_ref_no,
               smrd.material_type,
               smrd.invoice_no,
               smrd.supplier_id,
               smrd.invoice_date
           """, nativeQuery = true)
    List<Object[]> findAllReceiptSummaryByPoRefNo(
            @Param("poRefNo") Long poRefNo);

    @Query(value = """
           SELECT
               smrd.receipt_det_id                              AS receiptDetId,
               sport.po_ref_no                                  AS poRefNo,
               smrd.material_type                               AS materialType,
               smrd.invoice_no                                  AS invoiceNo,
               smrd.supplier_id                                 AS supplierId,
               smrd.invoice_date                                AS invoiceDate,
               SUM(sport.sgst_value)                            AS sgstValue,
               SUM(sport.cgst_value)                            AS cgstValue,
               SUM(sport.igst_value)                            AS igstValue,
               SUM(smrt.no_of_received)                         AS noOfReceived,
               SUM(smrt.no_of_received * smrt.per_unit_rate)    AS netAmount,
               SUM(sport.sgst_value) + SUM(sport.cgst_value)
                   + SUM(sport.igst_value)
                   + SUM(smrt.no_of_received * smrt.per_unit_rate)
                                                                AS totalAmount
           FROM sos_material_receipt_det_t smrd
           LEFT JOIN sos_material_receipt_t smrt
               ON smrd.receipt_det_id = smrt.receipt_det_id
           LEFT JOIN sos_po_details_t sport
               ON smrt.po_det_id = sport.po_det_id
           WHERE smrd.is_deleted = 0
           AND smrd.material_type = :materialType
           GROUP BY
               smrd.receipt_det_id,
               sport.po_ref_no,
               smrd.material_type,
               smrd.invoice_no,
               smrd.supplier_id,
               smrd.invoice_date
           """, nativeQuery = true)
    List<Object[]> findAllReceiptSummaryByMaterialType(
            @Param("materialType") String materialType);
    
    @Query(value = "SELECT COALESCE(MAX(grn_no), 0) + 1 FROM sos_material_receipt_det_t", nativeQuery = true)
    Long getNextGrnNo();

}