package com.sospl.inventory.service.inventory.view.impl;

import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.view.SosPurchaseOrderViewResponse;
import com.sospl.inventory.model.inventory.view.SosPurchaseOrderView;
import com.sospl.inventory.repository.inventory.view.SosPurchaseOrderViewRepository;
import com.sospl.inventory.service.inventory.view.SosPurchaseOrderViewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SosPurchaseOrderViewServiceImpl
        implements SosPurchaseOrderViewService {

    private final SosPurchaseOrderViewRepository repository;

    public SosPurchaseOrderViewServiceImpl(
            SosPurchaseOrderViewRepository repository) {
        this.repository = repository;
    }

    @Override
    public SosPurchaseOrderViewResponse findById(Long poRefNo) {
        return repository.findByPoRefNo(poRefNo)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException(
                        "Purchase order not found with id: " + poRefNo));
    }

    @Override
    public PagedResponse<SosPurchaseOrderViewResponse> findAllPaginated(
            int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return buildPagedResponse(repository.findAllPaginated(pageable));
    }

    @Override
    public PagedResponse<SosPurchaseOrderViewResponse> findBySupplier(
            Long supplierId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return buildPagedResponse(
                repository.findBySupplierId(supplierId, pageable));
    }

    @Override
    public PagedResponse<SosPurchaseOrderViewResponse> findByDateRange(
            LocalDateTime fromDate, LocalDateTime toDate,
            int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return buildPagedResponse(
                repository.findByDateRange(fromDate, toDate, pageable));
    }

    @Override
    public PagedResponse<SosPurchaseOrderViewResponse> findBySupplierAndDateRange(
            Long supplierId, LocalDateTime fromDate, LocalDateTime toDate,
            int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return buildPagedResponse(
                repository.findBySupplierIdAndDateRange(
                        supplierId, fromDate, toDate, pageable));
    }

    @Override
    public PagedResponse<SosPurchaseOrderViewResponse> search(
            String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return buildPagedResponse(
                repository.searchPaginated(keyword, pageable));
    }

    private PagedResponse<SosPurchaseOrderViewResponse> buildPagedResponse(
            Page<SosPurchaseOrderView> pageData) {
        List<SosPurchaseOrderViewResponse> content = pageData.getContent()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return new PagedResponse<>(
                content,
                pageData.getNumber(),
                pageData.getSize(),
                pageData.getTotalElements(),
                pageData.getTotalPages(),
                pageData.isFirst(),
                pageData.isLast()
        );
    }

    private SosPurchaseOrderViewResponse mapToResponse(
            SosPurchaseOrderView entity) {
        SosPurchaseOrderViewResponse response =
                new SosPurchaseOrderViewResponse();
        response.setPoRefNo(entity.getPoRefNo());
        response.setPoNo(entity.getPoNo());
        response.setPoDate(entity.getPoDate());
        response.setPoKindAttention(entity.getPoKindAttention());
        response.setSupplierId(entity.getSupplierId());
        response.setSupplierCode(entity.getSupplierCode());
        response.setSupplierName(entity.getSupplierName());
        response.setPoDeliverySchedule(entity.getPoDeliverySchedule());
        response.setPoPaymentTerms(entity.getPoPaymentTerms());
        response.setPoDeliveryTerms(entity.getPoDeliveryTerms());
        response.setPoType(entity.getPoType());
        response.setPoReference(entity.getPoReference());
        response.setPoRemarks(entity.getPoRemarks());
        response.setPoVat(entity.getPoVat());
        response.setPoCst(entity.getPoCst());
        response.setPoRefGenNo(entity.getPoRefGenNo());
        response.setRequestedBy(entity.getRequestedBy());
        response.setAddCharges(entity.getAddCharges());
        response.setPoClosedFlag(entity.getPoClosedFlag());
        response.setIsActive(entity.getIsActive());
        response.setCreatedBy(entity.getCreatedBy());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedBy(entity.getUpdatedBy());
        response.setUpdatedAt(entity.getUpdatedAt());
        return response;
    }
}