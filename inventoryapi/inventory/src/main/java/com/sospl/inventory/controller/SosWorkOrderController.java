package com.sospl.inventory.controller;

import com.sospl.inventory.dto.SosWorkOrderWithDetailsResponse;
import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.model.SosWorkOrder;
import com.sospl.inventory.model.master.SosProdMasterPmDetls;
import com.sospl.inventory.service.SosWorkOrderService;
import com.sospl.inventory.service.master.SosProdMasterPmDetlsService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/work-order")
public class SosWorkOrderController {

    private final SosWorkOrderService service;
    private final SosProdMasterPmDetlsService pmDetlsService;

    public SosWorkOrderController(SosWorkOrderService service,SosProdMasterPmDetlsService _pmDetlsService) {
        this.service = service;
        this.pmDetlsService = _pmDetlsService;
    }

    // ── Static paths FIRST — /{id} LAST ──────────────────────────────────

    // Get all active
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<SosWorkOrder>>> getAllActive() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Work orders fetched successfully",
                        service.findAllActive()));
    }

    // Get all active paginated
    @GetMapping
    public ResponseEntity<ApiResponse<Page<SosWorkOrder>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "woId") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Work orders fetched successfully",
                        service.findAllActivePaginated(pageable)));
    }

    // Search
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<SosWorkOrder>>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by("woId").descending());
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Search results fetched successfully",
                        service.search(keyword, pageable)));
    }

 // REPLACE WITH THIS
    @GetMapping("/dropdown")
    public ResponseEntity<ApiResponse<List<DropDownResponse>>> getDropdown() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Work order dropdown fetched successfully",
                        service.findAllForDropDown()));
    }

    // Get by po_id
    @GetMapping("/po/{poId}")
    public ResponseEntity<ApiResponse<List<SosWorkOrder>>> getByPoId(
            @PathVariable Long poId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Work orders fetched successfully",
                        service.findByPoId(poId)));
    }

    // Get by product_id
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<SosWorkOrder>>> getByProductId(
            @PathVariable Long productId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Work orders fetched successfully",
                        service.findByProductId(productId)));
    }

    // Get by pm_id
    @GetMapping("/pm/{pmId}")
    public ResponseEntity<ApiResponse<List<SosWorkOrder>>> getByPmId(
            @PathVariable Long pmId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Work orders fetched successfully",
                        service.findByPmId(pmId)));
    }

    // Get by plant
    @GetMapping("/plant/{plant}")
    public ResponseEntity<ApiResponse<List<SosWorkOrder>>> getByPlant(
            @PathVariable String plant) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Work orders fetched successfully",
                        service.findByPlant(plant)));
    }

    // Create
    @PostMapping
    public ResponseEntity<ApiResponse<SosWorkOrder>> create(
            @RequestBody SosWorkOrder request) {
        request.setIsActive(true);
        request.setIsDeleted(false);
        request.setCreatedAt(java.time.LocalDateTime.now());
        SosWorkOrder saved = service.save(request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Work order created successfully", saved));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SosWorkOrder>> update(
            @PathVariable Long id,
            @RequestBody SosWorkOrder request) {
        SosWorkOrder updated = service.update(id, request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Work order updated successfully", updated));
    }

    // Soft Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @RequestParam(defaultValue = "system") String deletedBy) {
        service.softDelete(id, deletedBy);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Work order deleted successfully", null));
    }
    
 // Get work orders with details by po_id
    @GetMapping("/details/po/{poId}")
    public ResponseEntity<ApiResponse<List<SosWorkOrderWithDetailsResponse>>> getWithDetailsByPoId(
            @PathVariable Long poId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Work orders fetched successfully",
                        service.findAllWorkOrdersWithDetailsByPoId(poId)));
    }

    // Get by id — ALWAYS LAST
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosWorkOrder>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Work order fetched successfully",
                        service.findById(id).orElseThrow(
                                () -> new RuntimeException(
                                        "Work order not found: " + id))));
    }
    
    
 // Get by product_id
    @GetMapping("/pm-details/product/{productId}")
    public ResponseEntity<ApiResponse<List<SosProdMasterPmDetls>>> getPmDetlsByProductId(
            @PathVariable Long productId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "PM details fetched successfully",
                        pmDetlsService.findByProductId(productId)));
    }
    
    @GetMapping("/pm-details/dropdown")
    public ResponseEntity<ApiResponse<List<DropDownResponse>>> getPmDetlsDropdown() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "PM details dropdown fetched successfully",
                        pmDetlsService.findAllForDropDown()));
    }

}