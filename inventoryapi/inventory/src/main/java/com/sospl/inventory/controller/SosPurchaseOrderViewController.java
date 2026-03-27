package com.sospl.inventory.controller;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.common.ReferenceNumberResponse;
import com.sospl.inventory.dto.inventory.SosPoHeaderRequest;
import com.sospl.inventory.dto.inventory.view.SosPurchaseOrderViewResponse;
import com.sospl.inventory.service.SosPoDetailsService;
import com.sospl.inventory.service.inventory.view.SosPurchaseOrderViewService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/inventory/purchase-order")
public class SosPurchaseOrderViewController {

    private final SosPurchaseOrderViewService service;
    private final SosPoDetailsService sosPoDetailsService;

    public SosPurchaseOrderViewController(
            SosPurchaseOrderViewService service,SosPoDetailsService _sosPodetailService) {
        this.service = service;
        this.sosPoDetailsService = _sosPodetailService;
    }

    
    @GetMapping("/generate-reference-number")
    public ResponseEntity<ApiResponse<ReferenceNumberResponse>> generateReferenceNumber(
            @RequestParam String prefix) {
        return ResponseEntity.ok(
                ApiResponse.success("Reference number generated successfully",
                        service.generateReferenceNumber(prefix)));
    }
    
    
 

    // Get all paginated - ordered by po_ref_no desc
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<SosPurchaseOrderViewResponse>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                ApiResponse.success("Purchase orders fetched successfully",
                        service.findAllPaginated(page, size)));
    }

    // Filter by supplier
    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<ApiResponse<PagedResponse<SosPurchaseOrderViewResponse>>> getBySupplier(
            @PathVariable Long supplierId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                ApiResponse.success("Purchase orders fetched successfully",
                        service.findBySupplier(supplierId, page, size)));
    }

    // Filter by date range
    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse<PagedResponse<SosPurchaseOrderViewResponse>>> getByDateRange(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime fromDate,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                ApiResponse.success("Purchase orders fetched successfully",
                        service.findByDateRange(
                                fromDate, toDate, page, size)));
    }

    // Filter by supplier and date range
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<PagedResponse<SosPurchaseOrderViewResponse>>> getBySupplierAndDateRange(
            @RequestParam Long supplierId,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime fromDate,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                ApiResponse.success("Purchase orders fetched successfully",
                        service.findBySupplierAndDateRange(
                                supplierId, fromDate, toDate, page, size)));
    }

    // Search by keyword
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<SosPurchaseOrderViewResponse>>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                ApiResponse.success("Search results fetched successfully",
                        service.search(keyword, page, size)));
    }
    
    
 // ── Create PO ─────────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<ApiResponse<Long>> createPo(
            @RequestBody SosPoHeaderRequest request) {
        Long poRefNo = service.savePo(request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase order created successfully",
                        poRefNo));
    }

    // ── Update PO — must be above /{id} ───────────────────────────────────
    @PutMapping("/{poRefNo}")
    public ResponseEntity<ApiResponse<Long>> updatePo(
            @PathVariable Long poRefNo,
            @RequestBody SosPoHeaderRequest request) {
        Long updatedRefNo = service.updatePo(poRefNo, request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase order updated successfully",
                        updatedRefNo));
    }
    
    // Get by id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosPurchaseOrderViewResponse>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Purchase order fetched successfully",
                        service.findById(id)));
    }
}
