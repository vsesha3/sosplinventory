package com.sospl.inventory.service.inventory.view.impl;

import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.common.ReferenceNumberResponse;
import com.sospl.inventory.dto.inventory.SosPoHeaderRequest;
import com.sospl.inventory.dto.inventory.view.SosPurchaseOrderViewResponse;
import com.sospl.inventory.model.inventory.view.SosPurchaseOrderView;
import com.sospl.inventory.repository.inventory.view.SosPoHeaderRepository;
import com.sospl.inventory.repository.inventory.view.SosPurchaseOrderViewRepository;
import com.sospl.inventory.service.inventory.view.SosPurchaseOrderViewService;
import com.sospl.inventory.util.GetCurrentFinancialYear;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


import com.sospl.inventory.dto.inventory.SosPoHeaderRequest;
import com.sospl.inventory.model.inventory.SosPoHeader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class SosPurchaseOrderViewServiceImpl
        implements SosPurchaseOrderViewService {

    private final SosPurchaseOrderViewRepository repository;
    private final SosPoHeaderRepository poHeaderRepository;
    
    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd");


    public SosPurchaseOrderViewServiceImpl(
            SosPurchaseOrderViewRepository repository,
            SosPoHeaderRepository poHeaderRepository) {
        this.repository = repository;
        this.poHeaderRepository = poHeaderRepository;
    }

    @Override
    public SosPurchaseOrderViewResponse findById(Long poRefNo) {
        return repository.findByPoRefNo(poRefNo)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException(
                        "Purchase order not found: " + poRefNo));
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

    @Override
    public ReferenceNumberResponse generateReferenceNumber(String prefix) {

        // Get current financial year from util
        String financialYear = GetCurrentFinancialYear.getCurrentFinancialYear();

        // Get next running number per prefix per financial year
        Integer nextNumber = poHeaderRepository
                .getNextRunningNumber(prefix, financialYear);
        if (nextNumber == null) nextNumber = 1;

        // Format 4 digit zero padded
        String formattedNumber = String.format("%04d", nextNumber);

        // Build reference number e.g. RM/0033/2025-2026
        String referenceNumber = prefix + "/" + formattedNumber
                + "/" + financialYear;

        return new ReferenceNumberResponse(referenceNumber);
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
    
    
    @Override
    public Long savePo(SosPoHeaderRequest request) {

        // Validate duplicate PO number
        if (poHeaderRepository.existsByPoNo(request.getPoNo())) {
            throw new RuntimeException(
                    "PO number already exists: " + request.getPoNo());
        }

        // Generate next po_ref_no
        Long poRefNo = poHeaderRepository.getNextPoRefNo();

        SosPoHeader header = new SosPoHeader();
   
        header.setPoNo(request.getPoNo());
        header.setPoType(request.getPoType());
        header.setPoKindAttention(request.getPoKindAttention());
        header.setSupplierId(request.getSupplierId());
        header.setPoPaymentTerms(request.getPoPaymentTerms());
        header.setPoDeliveryTerms(request.getPoDeliveryTerms());
        header.setPoReference(request.getPoReference());
        header.setPoRemarks(request.getPoRemarks());
        header.setAddCharges(request.getAddCharges());
        header.setIsActive(true);
        header.setIsDeleted(false);
        

        // Parse requestedBy if present
        if (request.getRequestedBy() != null
                && !request.getRequestedBy().isBlank()) {
            try {
                header.setRequestedBy(
                        Long.parseLong(request.getRequestedBy()));
            } catch (NumberFormatException e) {
                // requestedBy is employee string id like SOSPL-0161 — store as null
                header.setRequestedBy(null);
            }
        }

        header.setPoDate(parseDateTime(request.getPoDate()));
        header.setPoDeliverySchedule(
                parseDateTime(request.getPoDeliverySchedule()));

        poHeaderRepository.save(header);
        return poRefNo;
    }

    
    @Override
    public Long updatePo(Long poRefNo, SosPoHeaderRequest request) {

        SosPoHeader header = poHeaderRepository.findById(poRefNo)
                .orElseThrow(() -> new RuntimeException(
                        "PO not found with ref no: " + poRefNo));

        // Only update po_no if it changed
        if (!header.getPoNo().equals(request.getPoNo())
                && poHeaderRepository.existsByPoNo(request.getPoNo())) {
            throw new RuntimeException(
                    "PO number already exists: " + request.getPoNo());
        }

        header.setPoNo(request.getPoNo());
        header.setPoType(request.getPoType());
        header.setPoKindAttention(request.getPoKindAttention());
        header.setSupplierId(request.getSupplierId());
        header.setPoPaymentTerms(request.getPoPaymentTerms());
        header.setPoDeliveryTerms(request.getPoDeliveryTerms());
        header.setPoReference(request.getPoReference());
        header.setPoRemarks(request.getPoRemarks());
        
      
        header.setAddCharges(request.getAddCharges());
      
        if (request.getRequestedBy() != null
                && !request.getRequestedBy().isBlank()) {
            try {
                header.setRequestedBy(
                        Long.parseLong(request.getRequestedBy()));
            } catch (NumberFormatException e) {
                header.setRequestedBy(null);
            }
        }

        if (request.getPoDate() != null && !request.getPoDate().isBlank()) {
            header.setPoDate(parseDateTime(request.getPoDate()));
        }


        if (request.getPoDeliverySchedule() != null
                && !request.getPoDeliverySchedule().isBlank()) {
            header.setPoDeliverySchedule(
                    parseDateTime(request.getPoDeliverySchedule()));
        }

        poHeaderRepository.save(header);
        return poRefNo;
    }
    
    /**
     * Parses date string — handles multiple formats:
     * - "2026-03-18"                     (date only)
     * - "2026-03-18T00:00:00"            (local datetime)
     * - "2026-03-18T00:00:00.000Z"       (ISO with Z timezone)
     * - "2026-03-18T00:00:00.000+05:30"  (ISO with offset)
     */
    private LocalDateTime parseDateTime(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;

        // Remove Z or timezone offset and milliseconds — normalize to clean string
        String cleaned = dateStr
                .replace("Z", "")           // remove UTC marker
                .replaceAll("\\.\\d+$", "") // remove milliseconds e.g. .000
                .replaceAll("[+-]\\d{2}:\\d{2}$", ""); // remove timezone offset

        // Try full datetime first
        try {
            return LocalDateTime.parse(cleaned);
        } catch (Exception e) {
            // Fall back to date only
            try {
                return LocalDateTime.parse(
                        cleaned + "T00:00:00");
            } catch (Exception ex) {
                throw new RuntimeException(
                        "Invalid date format: " + dateStr);
            }
        }
    }
    
   
}