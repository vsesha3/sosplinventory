package com.sospl.inventory.controller.master;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.model.master.SosProdMasterPmDetls;
import com.sospl.inventory.service.master.SosProdMasterPmDetlsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inventory/product-pm-mapping")
public class SosProdMasterPmDetlsController {

    private final SosProdMasterPmDetlsService service;

    public SosProdMasterPmDetlsController(
            SosProdMasterPmDetlsService service) {
        this.service = service;
    }

    // ── Static paths FIRST — /{id} LAST ──────────────────────────────────

    // Get all active
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<SosProdMasterPmDetls>>> getAllActive() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "PM details fetched successfully",
                        service.findAllActive()));
    }

    // Dropdown
    @GetMapping("/dropdown")
    public ResponseEntity<ApiResponse<List<DropDownResponse>>> getDropdown() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "PM dropdown fetched successfully",
                        service.findAllForDropDown()));
    }

    // Get by product_id
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<SosProdMasterPmDetls>>> getByProductId(
            @PathVariable Long productId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "PM details fetched successfully",
                        service.findByProductId(productId)));
    }

    // Get by pm_id
    @GetMapping("/pm/{pmId}")
    public ResponseEntity<ApiResponse<List<SosProdMasterPmDetls>>> getByPmId(
            @PathVariable Long pmId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "PM details fetched successfully",
                        service.findByPmId(pmId)));
    }

    // Get by product_id and pm_id
    @GetMapping("/product/{productId}/pm/{pmId}")
    public ResponseEntity<ApiResponse<List<SosProdMasterPmDetls>>> getByProductIdAndPmId(
            @PathVariable Long productId,
            @PathVariable Long pmId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "PM details fetched successfully",
                        service.findByProductIdAndPmId(productId, pmId)));
    }

    // Create
    @PostMapping
    public ResponseEntity<ApiResponse<SosProdMasterPmDetls>> create(
            @RequestBody SosProdMasterPmDetls request) {
        request.setIsActive(true);
        request.setIsDeleted(false);
        request.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(
                ApiResponse.success(
                        "PM details created successfully",
                        service.save(request)));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SosProdMasterPmDetls>> update(
            @PathVariable Long id,
            @RequestBody SosProdMasterPmDetls request) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "PM details updated successfully",
                        service.update(id, request)));
    }

    // Soft Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @RequestParam(defaultValue = "system") String deletedBy) {
        service.softDelete(id, deletedBy);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "PM details deleted successfully", null));
    }

    // Get by id — ALWAYS LAST
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosProdMasterPmDetls>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "PM details fetched successfully",
                        service.findById(id).orElseThrow(
                                () -> new RuntimeException(
                                        "PM details not found: " + id))));
    }
}
