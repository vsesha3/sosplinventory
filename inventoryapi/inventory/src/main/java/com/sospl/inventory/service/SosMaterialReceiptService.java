package com.sospl.inventory.service;

import com.sospl.inventory.dto.inventory.SosMaterialReceiptDetRequest;
import com.sospl.inventory.dto.inventory.SosMaterialReceiptSummaryResponse;
import com.sospl.inventory.dto.inventory.SosMaterialReceiptWithRMDetailsResponse;
import com.sospl.inventory.model.SosMaterialReceipt;
import com.sospl.inventory.model.SosMaterialReceiptDet;
import com.sospl.inventory.service.common.BaseMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface SosMaterialReceiptService
        extends BaseMasterService<SosMaterialReceipt, Long> {

    // ── Extra methods specific to material receipt ────────────────────────
    List<SosMaterialReceipt> findAllByMaterialType(String materialType);

    Page<SosMaterialReceipt> findAllByMaterialType(
            String materialType, Pageable pageable);

    List<SosMaterialReceipt> findByPoRefNo(
            Long poRefNo, String materialType);

    Page<SosMaterialReceipt> search(
            String materialType, String keyword, Pageable pageable);

    void softDelete(Long receiptId, String deletedBy);
    
    
    Long saveReceipt(SosMaterialReceiptDetRequest request);
    
    
    
    Optional<SosMaterialReceiptDet> findHeaderByPoRefNoAndMaterialType(
            Long poRefNo);

    Optional<SosMaterialReceiptDet> findHeaderByPoRefNo(Long poRefNo);
    
    List<SosMaterialReceiptSummaryResponse> findAllReceiptSummary();
    List<SosMaterialReceiptSummaryResponse> findAllReceiptSummaryByMaterialType(
            String materialType);
    List<SosMaterialReceiptSummaryResponse> findAllReceiptSummaryByPoRefNo(
           Long  poRefNo);
    
    List<SosMaterialReceiptDetRequest> findFullReceiptByPoRefNo(Long poRefNo);
   
    SosMaterialReceiptDetRequest findFullReceiptByReceiptDetId(Long receiptDetId);
}