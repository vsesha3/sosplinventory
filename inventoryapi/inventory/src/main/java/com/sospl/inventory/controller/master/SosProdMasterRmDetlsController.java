package com.sospl.inventory.controller.master;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.master.SosProdMasterRmDetlsResponse;
import com.sospl.inventory.model.master.SosProdMasterRmDetls;
import com.sospl.inventory.service.master.SosProdMasterRmDetlsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inventory/product-rm-mapping")
public class SosProdMasterRmDetlsController {

    private final SosProdMasterRmDetlsService service;

    public SosProdMasterRmDetlsController(
            SosProdMasterRmDetlsService service) {
        this.service = service;
    }

    // ── Static paths FIRST — /{id} LAST ──────────────────────────────────

    // Get all active
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<SosProdMasterRmDetls>>> getAllActive() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM details fetched successfully",
                        service.findAllActive()));
    }

    // Get by product_id
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<SosProdMasterRmDetls>>> getByProductId(
            @PathVariable Long productId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM details fetched successfully",
                        service.findByProductId(productId)));
    }

    // Get by rm_id
    @GetMapping("/rm/{rmId}")
    public ResponseEntity<ApiResponse<List<SosProdMasterRmDetls>>> getByRmId(
            @PathVariable Long rmId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM details fetched successfully",
                        service.findByRmId(rmId)));
    }

    // Fetch RM details for WO with qty calculation
    @GetMapping("/wo/{woId}")
    public ResponseEntity<ApiResponse<List<SosProdMasterRmDetlsResponse>>> getRMDetailsForWO(
            @PathVariable Long woId,
            @RequestParam BigDecimal qty) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM details fetched successfully",
                        service.fetchRMdetailsForWOID(woId, qty)));
    }

    // Create
    @PostMapping
    public ResponseEntity<ApiResponse<SosProdMasterRmDetls>> create(
            @RequestBody SosProdMasterRmDetls request) {
        request.setIsActive(true);
        request.setIsDeleted(false);
        request.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM details created successfully",
                        service.save(request)));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SosProdMasterRmDetls>> update(
            @PathVariable Long id,
            @RequestBody SosProdMasterRmDetls request) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM details updated successfully",
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
                        "RM details deleted successfully", null));
    }

    // Get by id — ALWAYS LAST
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosProdMasterRmDetls>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM details fetched successfully",
                        service.findById(id).orElseThrow(
                                () -> new RuntimeException(
                                        "RM details not found: " + id))));
    }
}