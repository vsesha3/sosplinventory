package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosRmMasterRequest;
import com.sospl.inventory.dto.inventory.master.SosRmMasterResponse;
import com.sospl.inventory.service.inventory.master.SosRmMasterService;
import jakarta.validation.Valid;
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
@RequestMapping("/api/rm")
public class SosRmMasterController {

    private final SosRmMasterService service;

    public SosRmMasterController(SosRmMasterService service) {
        this.service = service;
    }

    // Create
    @PostMapping
    public ResponseEntity<ApiResponse<SosRmMasterResponse>> create(
            @Valid @RequestBody SosRmMasterRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("RM created successfully",
                        service.create(request)));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SosRmMasterResponse>> update(
            @PathVariable Integer id,
            @Valid @RequestBody SosRmMasterRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("RM updated successfully",
                        service.update(id, request)));
    }

    // Get by id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosRmMasterResponse>> getById(
            @PathVariable Integer id) {
        return ResponseEntity.ok(
                ApiResponse.success("RM fetched successfully",
                        service.findById(id)));
    }

    // Get all without pagination
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<SosRmMasterResponse>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.success("RMs fetched successfully",
                        service.findAll()));
    }

    // Get all with pagination
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

    // Search with pagination
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

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.ok(
                ApiResponse.success("RM deleted successfully"));
    }
}
