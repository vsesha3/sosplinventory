package com.sospl.inventory.service.auth;

import com.sospl.inventory.dto.auth.AuthResponse;
import com.sospl.inventory.dto.auth.LoginRequest;
import com.sospl.inventory.dto.auth.RegisterRequest;
import com.sospl.inventory.dto.auth.ChangePasswordRequest;

public interface SosAuthService {

    AuthResponse login(LoginRequest request, String ipAddress, String deviceInfo);

    AuthResponse register(RegisterRequest request);

    void logout(String token);

    void changePassword(Long userId, ChangePasswordRequest request);

    AuthResponse refreshToken(String token);
}