package com.sospl.inventory.controller;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.model.SosPurchaseOrder;
import com.sospl.inventory.service.SosPurchaseOrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inventory/sales-orders")
public class SosPurchaseOrderController {

    private final SosPurchaseOrderService service;

    public SosPurchaseOrderController(
            SosPurchaseOrderService service) {
        this.service = service;
    }

    // ── Static paths FIRST — /{id} LAST ──────────────────────────────────

    // Get all active
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<SosPurchaseOrder>>> getAllActive() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase orders fetched successfully",
                        service.findAllActive()));
    }

    // Get all paginated
    @GetMapping
    public ResponseEntity<ApiResponse<Page<SosPurchaseOrder>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "poId") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase orders fetched successfully",
                        service.findAllActivePaginated(pageable)));
    }

    // Search
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<SosPurchaseOrder>>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by("poId").descending());
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Search results fetched successfully",
                        service.search(keyword, pageable)));
    }

    // Dropdown
    @GetMapping("/dropdown")
    public ResponseEntity<ApiResponse<List<SosPurchaseOrder>>> getDropdown() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase order dropdown fetched successfully",
                        service.findAllForDropdown()));
    }

    // Get by po_number
    @GetMapping("/number/{poNumber}")
    public ResponseEntity<ApiResponse<SosPurchaseOrder>> getByPoNumber(
            @PathVariable String poNumber) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase order fetched successfully",
                        service.findByPoNumber(poNumber)));
    }

    // Get by company_id
    @GetMapping("/company/{companyId}")
    public ResponseEntity<ApiResponse<List<SosPurchaseOrder>>> getByCompanyId(
            @PathVariable Long companyId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase orders fetched successfully",
                        service.findByCompanyId(companyId)));
    }

    // Get partial POs
    @GetMapping("/partial")
    public ResponseEntity<ApiResponse<List<SosPurchaseOrder>>> getPartialPOs() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Partial purchase orders fetched successfully",
                        service.findByPartialPoFlag(true)));
    }

    // Create
    @PostMapping
    public ResponseEntity<ApiResponse<SosPurchaseOrder>> create(
            @RequestBody SosPurchaseOrder request) {
        request.setIsActive(true);
        request.setIsDeleted(false);
        request.setCreatedAt(LocalDateTime.now());
        SosPurchaseOrder saved = service.save(request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase order created successfully", saved));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SosPurchaseOrder>> update(
            @PathVariable Long id,
            @RequestBody SosPurchaseOrder request) {
        SosPurchaseOrder updated = service.update(id, request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase order updated successfully", updated));
    }

    // Soft Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @RequestParam(defaultValue = "system") String deletedBy) {
        service.softDelete(id, deletedBy);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase order deleted successfully", null));
    }

    // Get by id — ALWAYS LAST
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosPurchaseOrder>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Purchase order fetched successfully",
                        service.findById(id).orElseThrow(
                                () -> new RuntimeException(
                                        "Purchase order not found: "
                                                + id))));
    }
}