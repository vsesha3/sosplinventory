package com.sospl.inventory.service.impl;

import com.sospl.inventory.model.SosPurchaseOrder;
import com.sospl.inventory.repository.SosPurchaseOrderRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.SosPurchaseOrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SosPurchaseOrderServiceImpl
        extends BaseMasterServiceImpl<SosPurchaseOrder, Long>
        implements SosPurchaseOrderService {

    private static final Logger log =
            LoggerFactory.getLogger(SosPurchaseOrderServiceImpl.class);

    private final SosPurchaseOrderRepository purchaseOrderRepository;

    public SosPurchaseOrderServiceImpl(
            SosPurchaseOrderRepository repository) {
        super(repository);
        this.purchaseOrderRepository = repository;
    }

    @Override
    public List<SosPurchaseOrder> findAllActive() {
        return purchaseOrderRepository
                .findAllByIsActiveTrueAndIsDeletedFalse();
    }

    @Override
    public Page<SosPurchaseOrder> findAllActivePaginated(
            Pageable pageable) {
        return purchaseOrderRepository
                .findAllByIsActiveTrueAndIsDeletedFalse(pageable);
    }

    @Override
    public SosPurchaseOrder findByPoNumber(String poNumber) {
        return purchaseOrderRepository
                .findByPoNumberAndIsDeletedFalse(poNumber)
                .orElseThrow(() -> new RuntimeException(
                        "Purchase order not found: " + poNumber));
    }

    @Override
    public List<SosPurchaseOrder> findByCompanyId(Long companyId) {
        return purchaseOrderRepository
                .findAllByCompanyIdAndIsDeletedFalse(companyId);
    }

    @Override
    public List<SosPurchaseOrder> findByPartialPoFlag(
            Boolean partialPoFlag) {
        return purchaseOrderRepository
                .findAllByPartialPoFlagAndIsDeletedFalse(partialPoFlag);
    }

    @Override
    public Page<SosPurchaseOrder> search(
            String keyword, Pageable pageable) {
        return purchaseOrderRepository.search(keyword, pageable);
    }

    @Override
    public List<SosPurchaseOrder> findAllForDropdown() {
        return purchaseOrderRepository.findAllForDropdown();
    }

    @Override
    public void softDelete(Long poId, String deletedBy) {
        SosPurchaseOrder existing = purchaseOrderRepository
                .findById(poId)
                .orElseThrow(() -> new RuntimeException(
                        "Purchase order not found: " + poId));
        existing.setIsDeleted(true);
        existing.setIsActive(false);
        existing.setDeletedBy(deletedBy);
        existing.setDeletedAt(LocalDateTime.now());
        purchaseOrderRepository.save(existing);
        log.info("Purchase order soft deleted — poId: {}", poId);
    }
}