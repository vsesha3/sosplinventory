package com.sospl.inventory.controller.rmrequest;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.rmrequest.SosRmRequestDto;
import com.sospl.inventory.dto.rmrequest.SosRmRequestViewResponse;
import com.sospl.inventory.model.rmrequest.SosRmRequest;
import com.sospl.inventory.model.rmrequest.SosRmRequestDetls;
import com.sospl.inventory.service.rmrequest.SosRmRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inventory/rm-request")
public class SosRmRequestController {

    private final SosRmRequestService service;

    public SosRmRequestController(SosRmRequestService service) {
        this.service = service;
    }

    // ── Static paths FIRST — /{id} LAST ──────────────────────────────────

    // Save header + lines
    @PostMapping("/save")
    public ResponseEntity<ApiResponse<Long>> save(
            @RequestBody SosRmRequestDto request) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM request saved successfully",
                        service.saveRmRequest(request)));
    }

    // Get all active
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<SosRmRequest>>> getAllActive() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM requests fetched successfully",
                        service.findAllActive()));
    }

    // Get pending requests — is_rm_issue_completed = false
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<SosRmRequest>>> getPending() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Pending RM requests fetched successfully",
                        service.findPendingRequests()));
    }

    // Get by wo_id
    @GetMapping("/wo/{woId}")
    public ResponseEntity<ApiResponse<List<SosRmRequest>>> getByWoId(
            @PathVariable Long woId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM requests fetched successfully",
                        service.findByWoId(woId)));
    }

    // Get by production_plan_id
    @GetMapping("/plan/{productionPlanId}")
    public ResponseEntity<ApiResponse<List<SosRmRequest>>> getByProductionPlanId(
            @PathVariable Long productionPlanId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM requests fetched successfully",
                        service.findByProductionPlanId(
                                productionPlanId)));
    }

    // Get lines by rm_req_id
    @GetMapping("/{rmReqId}/lines")
    public ResponseEntity<ApiResponse<List<SosRmRequestDetls>>> getLinesByRmReqId(
            @PathVariable Long rmReqId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM request lines fetched successfully",
                        service.findLinesByRmReqId(rmReqId)));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SosRmRequest>> update(
            @PathVariable Long id,
            @RequestBody SosRmRequest request) {
        request.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM request updated successfully",
                        service.update(id, request)));
    }

    // Soft delete header
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @RequestParam(defaultValue = "system") String deletedBy) {
        service.softDelete(id, deletedBy);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM request deleted successfully", null));
    }

    // Soft delete line
    @DeleteMapping("/line/{lineId}")
    public ResponseEntity<ApiResponse<Void>> deleteLine(
            @PathVariable Long lineId,
            @RequestParam(defaultValue = "system") String deletedBy) {
        service.softDeleteLine(lineId, deletedBy);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM request line deleted successfully", null));
    }
    
 // REPLACE WITH THIS
    @GetMapping("/view")
    public ResponseEntity<ApiResponse<PagedResponse<SosRmRequestViewResponse>>> getAllView(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM request view fetched successfully",
                        service.findAllRmRequestView(page, size)));
    }

    // Get by id — ALWAYS LAST
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosRmRequest>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM request fetched successfully",
                        service.findById(id).orElseThrow(
                                () -> new RuntimeException(
                                        "RM request not found: " + id))));
    }
}