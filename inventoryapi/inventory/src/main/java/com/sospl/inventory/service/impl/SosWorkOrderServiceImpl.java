package com.sospl.inventory.service.impl;

import com.sospl.inventory.dto.SosWorkOrderWithDetailsResponse;
import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.mapper.SosWorkOrderWithDetailsMapper;
import com.sospl.inventory.model.SosWorkOrder;
import com.sospl.inventory.repository.SosWorkOrderRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.SosWorkOrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SosWorkOrderServiceImpl
        extends BaseMasterServiceImpl<SosWorkOrder, Long>
        implements SosWorkOrderService {

    private static final Logger log =
            LoggerFactory.getLogger(SosWorkOrderServiceImpl.class);
    
    private final SosWorkOrderWithDetailsMapper workOrderMapper;

    private final SosWorkOrderRepository workOrderRepository;

    public SosWorkOrderServiceImpl(
            SosWorkOrderRepository repository,SosWorkOrderWithDetailsMapper _workOrderMapper) {
        super(repository);
        this.workOrderRepository = repository;
        this.workOrderMapper = _workOrderMapper;
    }

    @Override
    public List<SosWorkOrder> findAllActive() {
        return workOrderRepository
                .findAllByIsActiveTrueAndIsDeletedFalse();
    }

    @Override
    public Page<SosWorkOrder> findAllActivePaginated(Pageable pageable) {
        return workOrderRepository
                .findAllByIsActiveTrueAndIsDeletedFalse(pageable);
    }

    @Override
    public List<SosWorkOrder> findByPoId(Long poId) {
        return workOrderRepository
                .findAllByPoIdAndIsDeletedFalse(poId);
    }

    @Override
    public List<SosWorkOrder> findByProductId(Long productId) {
        return workOrderRepository
                .findAllByProductIdAndIsDeletedFalse(productId);
    }

    @Override
    public List<SosWorkOrder> findByPmId(Long pmId) {
        return workOrderRepository
                .findAllByPmIdAndIsDeletedFalse(pmId);
    }

    @Override
    public List<SosWorkOrder> findByPlant(String plant) {
        return workOrderRepository
                .findAllByPlantAndIsDeletedFalse(plant);
    }

    @Override
    public Page<SosWorkOrder> search(
            String keyword, Pageable pageable) {
        return workOrderRepository.search(keyword, pageable);
    }

    @Override
    public List<SosWorkOrder> findAllForDropdown() {
        return workOrderRepository.findAllForDropdown();
    }

    @Override
    public void softDelete(Long woId, String deletedBy) {
        SosWorkOrder existing = workOrderRepository
                .findById(woId)
                .orElseThrow(() -> new RuntimeException(
                        "Work order not found: " + woId));
        existing.setIsDeleted(true);
        existing.setIsActive(false);
        existing.setDeletedBy(deletedBy);
        existing.setDeletedAt(LocalDateTime.now());
        workOrderRepository.save(existing);
        log.info("Work order soft deleted — woId: {}", woId);
    }
    
 // Add field
   

    // Update constructor
    @Override
    public List<SosWorkOrderWithDetailsResponse> findAllWorkOrdersWithDetailsByPoId(
            Long poId) {
        return workOrderMapper.mapRows(
                workOrderRepository
                        .findAllWorkOrdersWithDetailsByPoId(poId));
    }
    
    @Override
    public List<DropDownResponse> findAllForDropDown() {
        return workOrderRepository
                .findAllForDropdown()
                .stream()
                .filter(w -> w.getWoId() != null)
                .map(w -> new DropDownResponse(
                        w.getWoId(),
                        w.getWoCode() != null ? w.getWoCode() : "-"))
                .collect(Collectors.toList());
    }
}