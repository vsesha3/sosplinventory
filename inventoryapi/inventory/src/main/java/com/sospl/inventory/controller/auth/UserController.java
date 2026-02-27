package com.sospl.inventory.controller.auth;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.auth.RegisterRequest;
import com.sospl.inventory.dto.auth.UserResponse;
import com.sospl.inventory.service.auth.SosUserService;
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
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private SosUserService userService;

    // Get all users - Admin only
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(
                ApiResponse.success("Users fetched successfully", users));
    }

    // Get user by id
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(
                ApiResponse.success("User fetched successfully", user));
    }

    // Get my profile
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserResponse user = userService.getUserByUsername(
                userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("Profile fetched successfully", user));
    }

    // Search users
    @GetMapping("/search")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchUsers(
            @RequestParam String keyword) {
        List<UserResponse> users = userService.searchUsers(keyword);
        return ResponseEntity.ok(
                ApiResponse.success("Search results fetched", users));
    }

    // Update user
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody RegisterRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserResponse user = userService.updateUser(
                id, request, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("User updated successfully", user));
    }

    // Delete user
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        userService.deleteUser(id, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("User deleted successfully"));
    }

    // Activate user
    @PutMapping("/{id}/activate")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> activateUser(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        userService.activateUser(id, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("User activated successfully"));
    }

    // Deactivate user
    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivateUser(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        userService.deactivateUser(id, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("User deactivated successfully"));
    }

    // Lock user
    @PutMapping("/{id}/lock")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> lockUser(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        userService.lockUser(id, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("User locked successfully"));
    }

    // Unlock user
    @PutMapping("/{id}/unlock")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> unlockUser(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        userService.unlockUser(id, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("User unlocked successfully"));
    }

    // Assign role to user
    @PostMapping("/{userId}/roles/{roleId}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> assignRole(
            @PathVariable Long userId,
            @PathVariable Long roleId,
            @AuthenticationPrincipal UserDetails userDetails) {
        userService.assignRoleToUser(userId, roleId, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("Role assigned successfully"));
    }

    // Remove role from user
    @DeleteMapping("/{userId}/roles/{roleId}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> removeRole(
            @PathVariable Long userId,
            @PathVariable Long roleId,
            @AuthenticationPrincipal UserDetails userDetails) {
        userService.removeRoleFromUser(userId, roleId, userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("Role removed successfully"));
    }
}