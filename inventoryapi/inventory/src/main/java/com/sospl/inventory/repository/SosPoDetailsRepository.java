package com.sospl.inventory.repository;




import com.sospl.inventory.model.SosPoDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SosPoDetailsRepository extends JpaRepository<SosPoDetails, Long> {

    // Fetch all active line items for a given PO
    List<SosPoDetails> findByPoRefNoAndIsActiveTrue(Long poRefNo);

    // Soft delete all line items for a PO (used before re-saving updated list)
    @Modifying
    @Query("UPDATE SosPoDetails d SET d.isActive = false WHERE d.poRefNo = :poRefNo")
    void deactivateByPoRefNo(@Param("poRefNo") Long poRefNo);
    
    @Query(value = """
    	       SELECT
    	           pd.po_det_id        AS poDetId,
    	           pd.po_ref_no        AS poRefNo,
    	           pd.po_rm_code       AS poRmCode,
    	           pd.po_rm_name       AS poRmName,
    	           pd.po_qty           AS poQty,
    	           pd.po_rate          AS poRate,
    	           pd.po_uom           AS poUom,
    	           pd.sgst             AS sgst,
    	           pd.sgst_value       AS sgstValue,
    	           pd.cgst             AS cgst,
    	           pd.cgst_value       AS cgstValue,
    	           pd.igst             AS igst,
    	           pd.igst_value       AS igstValue,
    	           pd.po_no_of_packs   AS poNoOfPacks,
    	           pd.po_pack_size     AS poPackSize,
    	           pd.h_s_n_code       AS hSnCode,
    	           pd.is_active        AS isActive,
    	           pr.rm_received_qty  AS rmReceivedQty,
    	           pr.inspected_by     AS inspectedBy,
    	           pr.approved_by      AS approvedBy,
    	           mr.lot_no           AS lotNumber,
    	           pr.exp_date_del     AS expDateDel,
    	           pr.act_date_del     AS actDateDel,
    	           pr.po_receipt_no    AS poReceiptNo
    	       FROM sos_po_details_t pd
    	       LEFT JOIN sos_po_receipt_t pr
    	           ON pd.po_det_id = pr.po_det_id
    	           AND pr.is_deleted = 0
    	       LEFT JOIN sos_material_receipt_t mr
    	           ON pd.po_det_id = mr.po_det_id
    	           AND mr.is_deleted = 0
    	       WHERE pd.po_ref_no = :poRefNo
    	       AND pd.is_deleted = 0
    	       """, nativeQuery = true)
    	List<Object[]> findByPoRefNoWithReceipt(
    	        @Param("poRefNo") Long poRefNo);   	
    
}