package com.sospl.inventory.service.inventory.view;

import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.SosPoHeaderRequest;
import com.sospl.inventory.dto.common.ReferenceNumberResponse;
import com.sospl.inventory.dto.inventory.view.SosPurchaseOrderViewResponse;

import java.time.LocalDateTime;

public interface SosPurchaseOrderViewService {

    SosPurchaseOrderViewResponse findById(Long poRefNo);

    PagedResponse<SosPurchaseOrderViewResponse> findAllPaginated(
            int page, int size);

    PagedResponse<SosPurchaseOrderViewResponse> findBySupplier(
            Long supplierId, int page, int size);

    PagedResponse<SosPurchaseOrderViewResponse> findByDateRange(
            LocalDateTime fromDate, LocalDateTime toDate,
            int page, int size);

    PagedResponse<SosPurchaseOrderViewResponse> findBySupplierAndDateRange(
            Long supplierId, LocalDateTime fromDate, LocalDateTime toDate,
            int page, int size);

    PagedResponse<SosPurchaseOrderViewResponse> search(
            String keyword, int page, int size);

    // ← Updated — returns ReferenceNumberResponse
    ReferenceNumberResponse generateReferenceNumber(String prefix);
    
    Long savePo(SosPoHeaderRequest request);

    Long updatePo(Long poRefNo, SosPoHeaderRequest request);
}