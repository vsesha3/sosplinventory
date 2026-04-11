package com.sospl.inventory.service;

import com.sospl.inventory.dto.SosWorkOrderWithDetailsResponse;
import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.model.SosWorkOrder;
import com.sospl.inventory.service.common.BaseMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SosWorkOrderService
        extends BaseMasterService<SosWorkOrder, Long> {

    // ── Fetch ─────────────────────────────────────────────────────────────
    List<SosWorkOrder> findAllActive();

    Page<SosWorkOrder> findAllActivePaginated(Pageable pageable);

    List<SosWorkOrder> findByPoId(Long poId);

    List<SosWorkOrder> findByProductId(Long productId);

    List<SosWorkOrder> findByPmId(Long pmId);

    List<SosWorkOrder> findByPlant(String plant);

    Page<SosWorkOrder> search(String keyword, Pageable pageable);

    List<SosWorkOrder> findAllForDropdown();

    // ── Soft Delete ───────────────────────────────────────────────────────
    void softDelete(Long woId, String deletedBy);
    
    List<SosWorkOrderWithDetailsResponse> findAllWorkOrdersWithDetailsByPoId(
            Long poId);
    
    List<DropDownResponse> findAllForDropDown();
}