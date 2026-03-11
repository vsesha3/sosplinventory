package com.sospl.inventory.controller.inventory.view;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.view.SosPurchaseOrderViewResponse;
import com.sospl.inventory.service.inventory.view.SosPurchaseOrderViewService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/inventory/purchase-order")
public class SosPurchaseOrderViewController {

    private final SosPurchaseOrderViewService service;

    public SosPurchaseOrderViewController(
            SosPurchaseOrderViewService service) {
        this.service = service;
    }

    // Get by id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosPurchaseOrderViewResponse>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Purchase order fetched successfully",
                        service.findById(id)));
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
}
