package com.sospl.inventory.service;

import com.sospl.inventory.dto.inventory.SosMaterialReceiptRequest;
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
    
    
    Long saveReceipt(SosMaterialReceiptRequest request);
    
    
    
    Optional<SosMaterialReceiptDet> findHeaderByPoRefNoAndMaterialType(
            Long poRefNo);

    Optional<SosMaterialReceiptDet> findHeaderByPoRefNo(Long poRefNo);
}