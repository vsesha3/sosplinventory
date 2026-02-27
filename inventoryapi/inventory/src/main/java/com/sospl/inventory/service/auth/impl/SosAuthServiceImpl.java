package com.sospl.inventory.service.auth.impl;

import com.sospl.inventory.dto.auth.AuthResponse;
import com.sospl.inventory.dto.auth.ChangePasswordRequest;
import com.sospl.inventory.dto.auth.LoginRequest;
import com.sospl.inventory.dto.auth.RegisterRequest;
import com.sospl.inventory.model.auth.SosUser;
import com.sospl.inventory.model.auth.SosUserSession;
import com.sospl.inventory.repository.auth.SosUserRepository;
import com.sospl.inventory.repository.auth.SosUserRoleRepository;
import com.sospl.inventory.repository.auth.SosRoleRepository;
import com.sospl.inventory.repository.auth.SosRolePermissionRepository;
import com.sospl.inventory.repository.auth.SosPermissionRepository;
import com.sospl.inventory.repository.auth.SosUserSessionRepository;
import com.sospl.inventory.security.jwt.JwtUtil;
import com.sospl.inventory.service.auth.SosAuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class SosAuthServiceImpl implements SosAuthService {

    @Autowired
    private SosUserRepository userRepository;

    @Autowired
    private SosUserRoleRepository userRoleRepository;

    @Autowired
    private SosRoleRepository roleRepository;

    @Autowired
    private SosRolePermissionRepository rolePermissionRepository;

    @Autowired
    private SosPermissionRepository permissionRepository;

    @Autowired
    private SosUserSessionRepository sessionRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(LoginRequest request, String ipAddress, String deviceInfo) {

    	

    
     // Replace with this
        SosUser user = userRepository
                .findByUsernameAndIsDeletedFalse(request.getUsernameOrEmail())
                .orElseGet(() -> userRepository
                        .findByEmailAndIsDeletedFalse(request.getUsernameOrEmail())
                        .orElseThrow(() -> new RuntimeException("Invalid usernamess or password")));

        // Check if user is active
        if (!user.getIsActive()) {
            throw new RuntimeException("User account is deactivated");
        }

        // Check if user is locked
        if (user.getIsLocked()) {
            throw new RuntimeException("User account is locked");
        }

        
    	System.out.println("=== PASSWORD DEBUG ===");
    	System.out.println("Input password        : " + request.getPassword());
    	System.out.println("DB password hash      : " + user.getPassword());
    	System.out.println("Password match result : " + passwordEncoder.matches(
    	        request.getPassword(), user.getPassword()));
    	System.out.println("======================");
        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid usernames or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUsername());

        // Save session
        SosUserSession session = new SosUserSession();
        session.setUserId(user.getId());
        session.setToken(token);
        session.setIpAddress(ipAddress);
        session.setDeviceInfo(deviceInfo);
        session.setIsActive(true);
        session.setExpiresAt(LocalDateTime.now().plusHours(24));
        session.setCreatedBy(user.getUsername());
        sessionRepository.save(session);

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Build roles and permissions list
        List<String> roles = getRolesForUser(user.getId());
        List<String> permissions = getPermissionsForUser(user.getId());

        // Build response
        AuthResponse response = new AuthResponse();
        response.setAccessToken(token);
        response.setTokenType("Bearer");
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRoles(roles);
        response.setPermissions(permissions);
        response.setExpiresIn(86400L);
        return response;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        // Check username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        SosUser user = new SosUser();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setIsActive(true);
        user.setIsLocked(false);
        user.setIsDeleted(false);
        user.setCreatedBy("system");
        userRepository.save(user);

        // Generate token
        String token = jwtUtil.generateToken(user.getUsername());

        AuthResponse response = new AuthResponse();
        response.setAccessToken(token);
        response.setTokenType("Bearer");
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRoles(new ArrayList<>());
        response.setPermissions(new ArrayList<>());
        response.setExpiresIn(86400L);
        return response;
    }

    @Override
    public void logout(String token) {
        sessionRepository.findByTokenAndIsActiveTrueAndIsDeletedFalse(token)
                .ifPresent(session -> {
                    session.setIsActive(false);
                    session.setUpdatedAt(LocalDateTime.now());
                    sessionRepository.save(session);
                });
    }

    @Override
    public void changePassword(Long userId, ChangePasswordRequest request) {

        SosUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Validate new password and confirm match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New password and confirm password do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public AuthResponse refreshToken(String token) {
        String username = jwtUtil.extractUsername(token);
        SosUser user = userRepository
                .findByUsernameAndIsDeletedFalse(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newToken = jwtUtil.generateToken(user.getUsername());

        AuthResponse response = new AuthResponse();
        response.setAccessToken(newToken);
        response.setTokenType("Bearer");
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRoles(getRolesForUser(user.getId()));
        response.setPermissions(getPermissionsForUser(user.getId()));
        response.setExpiresIn(86400L);
        return response;
    }

    // Helper — get roles for user
    private List<String> getRolesForUser(Long userId) {
        List<String> roles = new ArrayList<>();
        userRoleRepository.findActiveRolesByUserId(userId).forEach(userRole ->
                roleRepository.findById(userRole.getRoleId()).ifPresent(role ->
                        roles.add(role.getRoleCode())
                )
        );
        return roles;
    }

    // Helper — get permissions for user
    private List<String> getPermissionsForUser(Long userId) {
        List<String> permissions = new ArrayList<>();
        userRoleRepository.findActiveRolesByUserId(userId).forEach(userRole ->
                rolePermissionRepository.findActivePermissionsByRoleId(userRole.getRoleId())
                        .forEach(rp ->
                                permissionRepository.findById(rp.getPermissionId()).ifPresent(p ->
                                        permissions.add(p.getPermissionCode())
                                )
                        )
        );
        return permissions;
    }
}