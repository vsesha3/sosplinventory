package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosRmMasterNativeResponse;
import com.sospl.inventory.dto.inventory.master.SosRmMasterRequest;
import com.sospl.inventory.dto.inventory.master.SosRmMasterResponse;
import com.sospl.inventory.service.inventory.master.SosRmMasterService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rm")
public class SosRmMasterController {

    private final SosRmMasterService service;

    public SosRmMasterController(SosRmMasterService service) {
        this.service = service;
    }

    // ── Existing endpoints — DO NOT CHANGE ────────────────────────────────

    @PostMapping
    public ResponseEntity<ApiResponse<SosRmMasterResponse>> create(
            @Valid @RequestBody SosRmMasterRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("RM created successfully",
                        service.create(request)));
    }
    
    @GetMapping("/details/long")
    public ResponseEntity<ApiResponse<List<SosRmMasterResponse>>> getAllWithDetailsLong() {
        return ResponseEntity.ok(
                ApiResponse.success("RMs fetched successfully",
                        service.findAllActiveWithDetailsLong()));
    }
    
    @GetMapping("/dropdown")
    public ResponseEntity<ApiResponse<List<DropDownResponse>>> getDropDown() {
        return ResponseEntity.ok(
                ApiResponse.success("RMs fetched successfully",
                        service.findAllForDropDown()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SosRmMasterResponse>> update(
            @PathVariable Integer id,
            @Valid @RequestBody SosRmMasterRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("RM updated successfully",
                        service.update(id, request)));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<SosRmMasterResponse>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.success("RMs fetched successfully",
                        service.findAll()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<SosRmMasterResponse>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "rmId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(
                ApiResponse.success("RMs fetched successfully",
                        service.findAllPaginated(page, size, sortBy, sortDir)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<SosRmMasterResponse>>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "rmId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(
                ApiResponse.success("Search results fetched successfully",
                        service.search(keyword, page, size, sortBy, sortDir)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.ok(
                ApiResponse.success("RM deleted successfully"));
    }

    // ── Must be above /{id} ───────────────────────────────────────────────

    // Get all active with uomName and packUomName - no pagination
    @GetMapping("/details")
    public ResponseEntity<ApiResponse<List<SosRmMasterNativeResponse>>> getAllWithDetails() {
        return ResponseEntity.ok(
                ApiResponse.success("RMs fetched successfully",
                        service.findAllActiveWithDetails()));
    }

    // Get all active with details - paginated
    @GetMapping("/details/page")
    public ResponseEntity<ApiResponse<PagedResponse<SosRmMasterNativeResponse>>> getAllWithDetailsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "rmName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(
                ApiResponse.success("RMs fetched successfully",
                        service.findAllActiveWithDetailsPaginated(
                                page, size, sortBy, sortDir)));
    }

    // Search active with details - paginated
    @GetMapping("/details/search")
    public ResponseEntity<ApiResponse<PagedResponse<SosRmMasterNativeResponse>>> searchWithDetails(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "rmName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(
                ApiResponse.success("Search results fetched successfully",
                        service.searchActiveWithDetails(
                                keyword, page, size, sortBy, sortDir)));
    }

    // ── Always last ───────────────────────────────────────────────────────

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosRmMasterResponse>> getById(
            @PathVariable Integer id) {
        return ResponseEntity.ok(
                ApiResponse.success("RM fetched successfully",
                        service.findById(id)));
    }
}