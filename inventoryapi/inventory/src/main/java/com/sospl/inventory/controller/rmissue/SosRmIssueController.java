package com.sospl.inventory.controller.rmissue;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.rmissue.SosRmIssueDto;
import com.sospl.inventory.dto.rmissue.SosRmIssueResponse;
import com.sospl.inventory.model.rmissue.SosRmIssue;
import com.sospl.inventory.model.rmissue.SosRmIssueDetails;
import com.sospl.inventory.service.rmissue.SosRmIssueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inventory/rm-issue")
public class SosRmIssueController {

    private final SosRmIssueService service;

    public SosRmIssueController(SosRmIssueService service) {
        this.service = service;
    }

    // ── Static paths FIRST — /{id} LAST ──────────────────────────────────

    // Save header + lines
    @PostMapping("/save")
    public ResponseEntity<ApiResponse<Long>> save(
            @RequestBody SosRmIssueDto request) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM issue saved successfully",
                        service.saveRmIssue(request)));
    }

    // Get all active
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<SosRmIssue>>> getAllActive() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM issues fetched successfully",
                        service.findAllActive()));
    }

    // Get all paginated
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<SosRmIssue>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM issues fetched successfully",
                        service.findAllActivePaginated(page, size)));
    }

    // Search
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<SosRmIssue>>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Search results fetched successfully",
                        service.search(keyword, page, size)));
    }

    // Get full issue by id — header + lines
    @GetMapping("/full/{rmIssueId}")
    public ResponseEntity<ApiResponse<SosRmIssueResponse>> getFullById(
            @PathVariable Long rmIssueId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM issue fetched successfully",
                        service.findFullIssueById(rmIssueId)));
    }

    // Get by rm_req_id
    @GetMapping("/req/{rmReqId}")
    public ResponseEntity<ApiResponse<List<SosRmIssue>>> getByRmReqId(
            @PathVariable Long rmReqId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM issues fetched successfully",
                        service.findByRmReqId(rmReqId)));
    }

    // Get by rm_req_detls_id
    @GetMapping("/req-detls/{rmReqDetlsId}")
    public ResponseEntity<ApiResponse<List<SosRmIssue>>> getByRmReqDetlsId(
            @PathVariable Long rmReqDetlsId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM issues fetched successfully",
                        service.findByRmReqDetlsId(rmReqDetlsId)));
    }

    // Get lines by rm_issue_id
    @GetMapping("/{rmIssueId}/lines")
    public ResponseEntity<ApiResponse<List<SosRmIssueDetails>>> getLinesByRmIssueId(
            @PathVariable Long rmIssueId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM issue lines fetched successfully",
                        service.findLinesByRmIssueId(rmIssueId)));
    }

    // Update header
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SosRmIssue>> update(
            @PathVariable Long id,
            @RequestBody SosRmIssue request) {
        request.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM issue updated successfully",
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
                        "RM issue deleted successfully", null));
    }

    // Soft delete line
    @DeleteMapping("/line/{lineId}")
    public ResponseEntity<ApiResponse<Void>> deleteLine(
            @PathVariable Long lineId,
            @RequestParam(defaultValue = "system") String deletedBy) {
        service.softDeleteLine(lineId, deletedBy);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM issue line deleted successfully", null));
    }

    // Get by id — ALWAYS LAST
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosRmIssue>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM issue fetched successfully",
                        service.findById(id).orElseThrow(
                                () -> new RuntimeException(
                                        "RM issue not found: " + id))));
    }
}