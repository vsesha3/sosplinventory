package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.inventory.master.SosProductGroupMasterRequest;
import com.sospl.inventory.dto.inventory.master.SosProductGroupMasterResponse;
import com.sospl.inventory.service.inventory.master.SosProductGroupMasterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
@RequestMapping("/api/inventory/master/product-groups")
public class SosProductGroupMasterController {

    @Autowired
    private SosProductGroupMasterService service;

    // Create
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<SosProductGroupMasterResponse>> create(
            @Valid @RequestBody SosProductGroupMasterRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        SosProductGroupMasterResponse response = service.create(
                request, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("Product group created successfully",
                        response));
    }

    // Get all
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<SosProductGroupMasterResponse>>> getAll() {

        List<SosProductGroupMasterResponse> responses = service.getAll();
        return ResponseEntity.ok(
                ApiResponse.success("Product groups fetched successfully",
                        responses));
    }

    // Get all active
    @GetMapping("/active")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<SosProductGroupMasterResponse>>> getAllActive() {

        List<SosProductGroupMasterResponse> responses = service.getAllActive();
        return ResponseEntity.ok(
                ApiResponse.success("Active product groups fetched successfully",
                        responses));
    }

    // Get by id
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<SosProductGroupMasterResponse>> getById(
            @PathVariable Long id) {

        SosProductGroupMasterResponse response = service.getById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Product group fetched successfully",
                        response));
    }

    // Get by product group id
    @GetMapping("/group/{productGroupId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<SosProductGroupMasterResponse>> getByProductGroupId(
            @PathVariable Integer productGroupId) {

        SosProductGroupMasterResponse response =
                service.getByProductGroupId(productGroupId);
        return ResponseEntity.ok(
                ApiResponse.success("Product group fetched successfully",
                        response));
    }

    // Get by ch head no
    @GetMapping("/ch-head/{chHeadNo}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<SosProductGroupMasterResponse>>> getByChHeadNo(
            @PathVariable Integer chHeadNo) {

        List<SosProductGroupMasterResponse> responses =
                service.getByChHeadNo(chHeadNo);
        return ResponseEntity.ok(
                ApiResponse.success("Product groups fetched by ch head no",
                        responses));
    }

    // Search
    @GetMapping("/search")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<SosProductGroupMasterResponse>>> search(
            @RequestParam String keyword) {

        List<SosProductGroupMasterResponse> responses =
                service.search(keyword);
        return ResponseEntity.ok(
                ApiResponse.success("Search results fetched successfully",
                        responses));
    }

    // Update
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<SosProductGroupMasterResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody SosProductGroupMasterRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        SosProductGroupMasterResponse response = service.update(
                id, request, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("Product group updated successfully",
                        response));
    }

    // Activate
    @PutMapping("/{id}/activate")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> activate(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        service.activate(id, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("Product group activated successfully"));
    }

    // Deactivate
    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivate(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        service.deactivate(id, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("Product group deactivated successfully"));
    }

    // Delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        service.delete(id, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("Product group deleted successfully"));
    }
}
