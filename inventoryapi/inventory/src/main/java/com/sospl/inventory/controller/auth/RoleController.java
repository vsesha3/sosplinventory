package com.sospl.inventory.controller.auth;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.auth.RoleRequest;
import com.sospl.inventory.dto.auth.RoleResponse;
import com.sospl.inventory.service.auth.SosRoleService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private SosRoleService roleService;

    // Get all roles
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getAllRoles() {
        List<RoleResponse> roles = roleService.getAllRoles();
        return ResponseEntity.ok(
                ApiResponse.success("Roles fetched successfully", roles));
    }

    // Get role by id
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<RoleResponse>> getRoleById(
            @PathVariable Long id) {
        RoleResponse role = roleService.getRoleById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Role fetched successfully", role));
    }

    // Create role
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<RoleResponse>> createRole(
            @Valid @RequestBody RoleRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        RoleResponse role = roleService.createRole(
                request, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("Role created successfully", role));
    }

    // Update role
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<RoleResponse>> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody RoleRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        RoleResponse role = roleService.updateRole(
                id, request, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("Role updated successfully", role));
    }

    // Delete role
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteRole(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        roleService.deleteRole(id, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("Role deleted successfully"));
    }

    // Assign permission to role
    @PostMapping("/{roleId}/permissions/{permissionId}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> assignPermission(
            @PathVariable Long roleId,
            @PathVariable Long permissionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        roleService.assignPermissionToRole(
                roleId, permissionId, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("Permission assigned to role successfully"));
    }

    // Remove permission from role
    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> removePermission(
            @PathVariable Long roleId,
            @PathVariable Long permissionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        roleService.removePermissionFromRole(
                roleId, permissionId, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("Permission removed from role successfully"));
    }
}