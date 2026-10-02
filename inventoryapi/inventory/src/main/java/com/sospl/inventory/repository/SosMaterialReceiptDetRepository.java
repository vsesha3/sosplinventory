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

    // Summary tax/total columns: tax = received amount × GST % of the line
    // (receipt line % first, falling back to the PO line % for older rows)
    String TAX_AND_TOTAL_COLUMNS = """
            COALESCE(SUM(smrt.no_of_received * smrt.per_unit_rate
                * COALESCE(smrt.sgst, sport.sgst, 0) / 100), 0)  AS sgstValue,
            COALESCE(SUM(smrt.no_of_received * smrt.per_unit_rate
                * COALESCE(smrt.cgst, sport.cgst, 0) / 100), 0)  AS cgstValue,
            COALESCE(SUM(smrt.no_of_received * smrt.per_unit_rate
                * COALESCE(smrt.igst, sport.igst, 0) / 100), 0)  AS igstValue,
            SUM(smrt.no_of_received)                             AS noOfReceived,
            COALESCE(SUM(smrt.no_of_received * smrt.per_unit_rate), 0) AS netAmount,
            COALESCE(SUM(smrt.no_of_received * smrt.per_unit_rate
                * (100 + COALESCE(smrt.sgst, sport.sgst, 0)
                       + COALESCE(smrt.cgst, sport.cgst, 0)
                       + COALESCE(smrt.igst, sport.igst, 0)) / 100), 0) AS totalAmount
            """;

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

    @Query(value = """
            SELECT
                smrd.receipt_det_id                              AS receiptDetId,
                sport.po_ref_no                                  AS poRefNo,
                smrd.material_type                               AS materialType,
                smrd.invoice_no                                  AS invoiceNo,
                smrd.supplier_id                                 AS supplierId,
                smrd.invoice_date                                AS invoiceDate,
                """ + TAX_AND_TOTAL_COLUMNS + """
                ,
                smrd.inward_type                                 AS inwardType,
                MAX(sup.supplier_name)                           AS supplierName
            FROM sos_material_receipt_det_t smrd
            LEFT JOIN sos_material_receipt_t smrt
                ON smrd.receipt_det_id = smrt.receipt_det_id
                AND smrt.is_deleted = 0
            LEFT JOIN sos_po_details_t sport
                ON smrt.po_det_id = sport.po_det_id
            LEFT JOIN sos_supplier_master_t sup
                ON smrd.supplier_id = sup.supplier_id
            WHERE smrd.is_deleted = 0
            GROUP BY
                smrd.receipt_det_id,
                sport.po_ref_no,
                smrd.material_type,
                smrd.invoice_no,
                smrd.supplier_id,
                smrd.invoice_date,
                smrd.inward_type
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
               """ + TAX_AND_TOTAL_COLUMNS + """
           FROM sos_material_receipt_det_t smrd
           LEFT JOIN sos_material_receipt_t smrt
               ON smrd.receipt_det_id = smrt.receipt_det_id
               AND smrt.is_deleted = 0
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
               """ + TAX_AND_TOTAL_COLUMNS + """
           FROM sos_material_receipt_det_t smrd
           LEFT JOIN sos_material_receipt_t smrt
               ON smrd.receipt_det_id = smrt.receipt_det_id
               AND smrt.is_deleted = 0
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
    
    
    
    @Query(value = """
            SELECT COALESCE(MAX(CAST(grn_no AS UNSIGNED)), 0) + 1
            FROM sos_material_receipt_det_t
            WHERE inward_type = 'BYPO'
            """, nativeQuery = true)
     Long getNextGrnNo();
    
    
 // Next GRN for job work inwards — separate column, separate sequence
    @Query(value = "SELECT COALESCE(MAX(job_grn_no), 0) + 1 FROM sos_material_receipt_det_t",
           nativeQuery = true)
    Integer getNextJobGrnNo();

}