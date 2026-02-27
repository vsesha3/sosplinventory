package com.sospl.inventory.controller.auth;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.auth.PermissionRequest;
import com.sospl.inventory.dto.auth.PermissionResponse;
import com.sospl.inventory.service.auth.SosPermissionService;
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
@RequestMapping("/api/permissions")
public class PermissionController {

    @Autowired
    private SosPermissionService permissionService;

    // Get all permissions
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<PermissionResponse>>> getAllPermissions() {
        List<PermissionResponse> permissions = permissionService.getAllPermissions();
        return ResponseEntity.ok(
                ApiResponse.success("Permissions fetched successfully", permissions));
    }

    // Get permission by id
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<PermissionResponse>> getPermissionById(
            @PathVariable Long id) {
        PermissionResponse permission = permissionService.getPermissionById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Permission fetched successfully", permission));
    }

    // Get permissions by module
    @GetMapping("/module/{module}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<PermissionResponse>>> getByModule(
            @PathVariable String module) {
        List<PermissionResponse> permissions =
                permissionService.getPermissionsByModule(module);
        return ResponseEntity.ok(
                ApiResponse.success("Permissions fetched by module", permissions));
    }

    // Create permission
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<PermissionResponse>> createPermission(
            @Valid @RequestBody PermissionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        PermissionResponse permission = permissionService.createPermission(
                request, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("Permission created successfully", permission));
    }

    // Update permission
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<PermissionResponse>> updatePermission(
            @PathVariable Long id,
            @Valid @RequestBody PermissionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        PermissionResponse permission = permissionService.updatePermission(
                id, request, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("Permission updated successfully", permission));
    }

    // Delete permission
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePermission(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        permissionService.deletePermission(id, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("Permission deleted successfully"));
    }
}