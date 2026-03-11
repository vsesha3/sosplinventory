package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosCapitalGoodsMasterResponse;
import com.sospl.inventory.model.inventory.master.SosCapitalGoodsMaster;
import com.sospl.inventory.service.inventory.master.SosCapitalGoodsMasterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/capitalgoods")
public class SosCapitalGoodsMasterController {

    private final SosCapitalGoodsMasterService service;

    public SosCapitalGoodsMasterController(
            SosCapitalGoodsMasterService service) {
        this.service = service;
    }

    // Create
    @PostMapping
    public ResponseEntity<ApiResponse<SosCapitalGoodsMaster>> create(
            @RequestBody SosCapitalGoodsMaster entity) {
        return ResponseEntity.ok(
                ApiResponse.success("Capital good created successfully",
                        service.save(entity)));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SosCapitalGoodsMaster>> update(
            @PathVariable Long id,
            @RequestBody SosCapitalGoodsMaster entity) {
        return ResponseEntity.ok(
                ApiResponse.success("Capital good updated successfully",
                        service.update(id, entity)));
    }

    // Get by id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosCapitalGoodsMaster>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Capital good fetched successfully",
                        service.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                        "Record not found"))));
    }

    // Get all with uomName - no pagination
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<SosCapitalGoodsMasterResponse>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.success("Capital goods fetched successfully",
                        service.findAllWithDetails()));
    }

    // Get all with uomName - paginated
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<SosCapitalGoodsMasterResponse>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "cgId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(
                ApiResponse.success("Capital goods fetched successfully",
                        service.findAllWithDetailsPaginated(
                                page, size, sortBy, sortDir)));
    }

    // Search with pagination
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<SosCapitalGoodsMasterResponse>>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "cgId") String sortBy,
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
                ApiResponse.success("Capital good deleted successfully", null));
    }
}