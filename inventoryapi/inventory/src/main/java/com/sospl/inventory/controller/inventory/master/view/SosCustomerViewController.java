package com.sospl.inventory.controller.inventory.master.view;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosCustomerMasterVResponse;
import com.sospl.inventory.service.inventory.master.view.SosCustomerViewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory/customer-view")
public class SosCustomerViewController {

    private final SosCustomerViewService service;

    public SosCustomerViewController(SosCustomerViewService service) {
        this.service = service;
    }

    // Get by id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosCustomerMasterVResponse>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Customer fetched successfully",
                        service.findById(id)));
    }

    // Get all paginated
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<SosCustomerMasterVResponse>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "customerId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(
                ApiResponse.success("Customers fetched successfully",
                        service.findAllPaginated(page, size, sortBy, sortDir)));
    }

    // Get all active paginated
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<PagedResponse<SosCustomerMasterVResponse>>> getAllActivePaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "customerId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(
                ApiResponse.success("Active customers fetched successfully",
                        service.findAllActivePaginated(
                                page, size, sortBy, sortDir)));
    }

    // Search with pagination
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<SosCustomerMasterVResponse>>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "customerId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(
                ApiResponse.success("Search results fetched successfully",
                        service.search(keyword, page, size, sortBy, sortDir)));
    }
}