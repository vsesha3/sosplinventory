package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosProductMasterResponse;
import com.sospl.inventory.model.inventory.master.SosProductMaster;
import com.sospl.inventory.service.inventory.master.SosProductMasterService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/product")
public class SosProductMasterController {

    private final SosProductMasterService service;

    public SosProductMasterController(SosProductMasterService service) {
        this.service = service;
    }

    // Create
    @PostMapping
    public ResponseEntity<ApiResponse<SosProductMaster>> create(
            @RequestBody SosProductMaster entity) {
        return ResponseEntity.ok(
                ApiResponse.success("Product created successfully",
                        service.save(entity)));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SosProductMaster>> update(
            @PathVariable Long id,
            @RequestBody SosProductMaster entity) {
        return ResponseEntity.ok(
                ApiResponse.success("Product updated successfully",
                        service.update(id, entity)));
    }

    // Get by id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosProductMaster>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Product fetched successfully",
                        service.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                        "Product not found"))));
    }

    // Get all without pagination
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<SosProductMaster>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.success("Products fetched successfully",
                        service.findAll()));
    }

    // Get all with details without pagination
    @GetMapping("/details")
    public ResponseEntity<ApiResponse<List<SosProductMasterResponse>>> getAllWithDetails() {
        return ResponseEntity.ok(
                ApiResponse.success("Products fetched successfully",
                        service.findAllWithDetails()));
    }

    // Get all with pagination
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<SosProductMasterResponse>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "productId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        return ResponseEntity.ok(
                ApiResponse.success("Products fetched successfully",
                        service.findAllPaginated(page, size, sortBy, sortDir)));
    }

    // Search with pagination
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<SosProductMasterResponse>>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "productId") String sortBy,
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
                ApiResponse.success("Product deleted successfully"));
    }
    
    @GetMapping("/dropdown")
    public ResponseEntity<ApiResponse<List<DropDownResponse>>> getDropdown() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "PM dropdown fetched successfully",
                        service.findAllForDropDown()));
    }
    
}