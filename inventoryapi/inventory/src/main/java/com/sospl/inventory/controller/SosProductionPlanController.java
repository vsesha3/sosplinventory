package com.sospl.inventory.controller;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.SosProductionPlanResponse;
import com.sospl.inventory.model.SosProductionPlan;
import com.sospl.inventory.service.SosProductionPlanService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inventory/production-plan")
public class SosProductionPlanController {

    private final SosProductionPlanService service;

    public SosProductionPlanController(
            SosProductionPlanService service) {
        this.service = service;
    }

    // ── Static paths FIRST — /{id} LAST ──────────────────────────────────

    @GetMapping("/details")
    public ResponseEntity<ApiResponse<PagedResponse<SosProductionPlanResponse>>> getAllWithDetails(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Production plans fetched successfully",
                        service.findAllWithDetails(page, size)));
    }

 // Get with details by wo_id — no pagination needed — wo specific
    @GetMapping("/details/wo/{woId}")
    public ResponseEntity<ApiResponse<List<SosProductionPlanResponse>>> getWithDetailsByWoId(
            @PathVariable Long woId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Production plans fetched successfully",
                        service.findAllWithDetailsByWoId(woId)));
    }

    // Get all active
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<SosProductionPlan>>> getAllActive() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Production plans fetched successfully",
                        service.findAllActive()));
    }

    // Get all paginated
    @GetMapping
    public ResponseEntity<ApiResponse<Page<SosProductionPlan>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "productionPlanId") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Production plans fetched successfully",
                        service.findAllActivePaginated(pageable)));
    }

    // Search
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<SosProductionPlan>>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by("productionPlanId").descending());
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Search results fetched successfully",
                        service.search(keyword, pageable)));
    }

    // Get by wo_id
    @GetMapping("/wo/{woId}")
    public ResponseEntity<ApiResponse<List<SosProductionPlan>>> getByWoId(
            @PathVariable Long woId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Production plans fetched successfully",
                        service.findByWoId(woId)));
    }

    // Get by vessel_id
    @GetMapping("/vessel/{vesselId}")
    public ResponseEntity<ApiResponse<List<SosProductionPlan>>> getByVesselId(
            @PathVariable Long vesselId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Production plans fetched successfully",
                        service.findByVesselId(vesselId)));
    }

    // Create
    @PostMapping
    public ResponseEntity<ApiResponse<SosProductionPlan>> create(
            @RequestBody SosProductionPlan request) {
        request.setIsActive(true);
        request.setIsDeleted(false);
        request.setCreatedAt(LocalDateTime.now());
        SosProductionPlan saved = service.save(request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Production plan created successfully",
                        saved));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SosProductionPlan>> update(
            @PathVariable Long id,
            @RequestBody SosProductionPlan request) {
        SosProductionPlan updated = service.update(id, request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Production plan updated successfully",
                        updated));
    }

    // Soft Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @RequestParam(defaultValue = "system") String deletedBy) {
        service.softDelete(id, deletedBy);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Production plan deleted successfully", null));
    }

    // Get by id — ALWAYS LAST
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosProductionPlan>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Production plan fetched successfully",
                        service.findById(id).orElseThrow(
                                () -> new RuntimeException(
                                        "Production plan not found: "
                                                + id))));
    }
}