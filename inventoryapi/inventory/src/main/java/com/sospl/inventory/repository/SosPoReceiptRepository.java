package com.sospl.inventory.repository;

import com.sospl.inventory.model.SosPoReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SosPoReceiptRepository
        extends JpaRepository<SosPoReceipt, Long> {

    // Find all by po_no
    List<SosPoReceipt> findAllByPoNoAndIsDeletedFalse(Long poNo);

    // Find all by receipt_det_id
    List<SosPoReceipt> findAllByReceiptDetIdAndIsDeletedFalse(
            Long receiptDetId);

    // Find all by po_det_id
    List<SosPoReceipt> findAllByPoDetIdAndIsDeletedFalse(Long poDetId);
}