package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.model.inventory.master.SosTestMaster;
import com.sospl.inventory.service.inventory.master.SosTestMasterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory/test-master")
public class SosTestMasterController {

    private final SosTestMasterService service;

    public SosTestMasterController(SosTestMasterService service) {
        this.service = service;
    }

    // Create
    @PostMapping
    public ResponseEntity<ApiResponse<SosTestMaster>> create(
            @RequestBody SosTestMaster entity) {
        return ResponseEntity.ok(
                ApiResponse.success("Test master created successfully",
                        service.save(entity)));
    }
    
    
    @GetMapping("/dropdown")
    public ResponseEntity<ApiResponse<List<DropDownResponse>>> getDropDown() {
        return ResponseEntity.ok(
                ApiResponse.success("RMs fetched successfully",
                        service.findAllForDropDown()));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SosTestMaster>> update(
            @PathVariable Long id,
            @RequestBody SosTestMaster entity) {
        return ResponseEntity.ok(
                ApiResponse.success("Test master updated successfully",
                        service.update(id, entity)));
    }

    // Get by id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosTestMaster>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Test master fetched successfully",
                        service.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                        "Test master not found"))));
    }

    // Get all active - no pagination
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<SosTestMaster>>> getAllActive() {
        return ResponseEntity.ok(
                ApiResponse.success("Active test masters fetched successfully",
                        service.findAllActive()));
    }

    // Get all active - paginated
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<SosTestMaster>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "testId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(
                ApiResponse.success("Test masters fetched successfully",
                        service.findAllActivePaginated(
                                page, size, sortBy, sortDir)));
    }

    // Search with pagination
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<SosTestMaster>>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "testId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(
                ApiResponse.success("Search results fetched successfully",
                        service.search(keyword, page, size, sortBy, sortDir)));
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(
                ApiResponse.success("Test master deleted successfully", null));
    }
}