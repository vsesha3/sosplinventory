package com.sospl.inventory.controller.auth;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.auth.AuthResponse;
import com.sospl.inventory.dto.auth.ChangePasswordRequest;
import com.sospl.inventory.dto.auth.LoginRequest;
import com.sospl.inventory.dto.auth.RegisterRequest;
import com.sospl.inventory.service.auth.SosAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private SosAuthService authService;

    // Login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = httpRequest.getRemoteAddr();
        String deviceInfo = httpRequest.getHeader("User-Agent");

        AuthResponse authResponse = authService.login(request, ipAddress, deviceInfo);
        return ResponseEntity.ok(
                ApiResponse.success("Login successful", authResponse));
    }

    // Register
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse authResponse = authService.register(request);
        return ResponseEntity.ok(
                ApiResponse.success("Registration successful", authResponse));
    }

    // Logout
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            authService.logout(token);
        }
        return ResponseEntity.ok(
                ApiResponse.success("Logout successful"));
    }

    // Refresh token
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        AuthResponse authResponse = authService.refreshToken(token);
        return ResponseEntity.ok(
                ApiResponse.success("Token refreshed successfully", authResponse));
    }

    // Change password
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Get user id from security context
        // We will improve this later with a proper user context helper
        return ResponseEntity.ok(
                ApiResponse.success("Password changed successfully"));
    }

    // Get current logged in user info
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<String>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                ApiResponse.success("Current user fetched",
                        userDetails.getUsername()));
    }
    
    @GetMapping("/heartBeat")
    public ResponseEntity<ApiResponse<String>> HeartBeat(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                ApiResponse.success("Working","Svs"));
                        
    }
}