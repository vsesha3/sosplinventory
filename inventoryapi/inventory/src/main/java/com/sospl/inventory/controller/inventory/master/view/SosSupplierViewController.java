package com.sospl.inventory.controller.inventory.master.view;

// Match your actual service package
import com.sospl.inventory.service.inventory.master.view.SosSupplierViewService;
import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosSupplierMasterVResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supplier-view")
public class SosSupplierViewController {

    private final SosSupplierViewService service;

    public SosSupplierViewController(SosSupplierViewService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<SosSupplierMasterVResponse>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.success("Suppliers fetched successfully",
                        service.findAll()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<SosSupplierMasterVResponse>>> getAllActive() {
        return ResponseEntity.ok(
                ApiResponse.success("Active suppliers fetched successfully",
                        service.findAllActive()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosSupplierMasterVResponse>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Supplier fetched successfully",
                        service.findById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<SosSupplierMasterVResponse>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "supplierId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(
                ApiResponse.success("Suppliers fetched successfully",
                        service.findAllPaginated(page, size, sortBy, sortDir)));
    }

    @GetMapping("/active/page")
    public ResponseEntity<ApiResponse<PagedResponse<SosSupplierMasterVResponse>>> getAllActivePaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "supplierId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(
                ApiResponse.success("Active suppliers fetched successfully",
                        service.findAllActivePaginated(page, size, sortBy, sortDir)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<SosSupplierMasterVResponse>>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "supplierId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(
                ApiResponse.success("Search results fetched successfully",
                        service.search(keyword, page, size, sortBy, sortDir)));
    }
    
    @GetMapping("/dropdown")
    public ResponseEntity<ApiResponse<List<DropDownResponse>>> getDropDown() {
        return ResponseEntity.ok(
                ApiResponse.success("Suppliers fetched successfully",
                        service.findAllForDropDown()));
    }
}