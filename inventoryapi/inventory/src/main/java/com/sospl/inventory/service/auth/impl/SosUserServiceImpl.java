package com.sospl.inventory.service.auth.impl;

import com.sospl.inventory.dto.auth.RegisterRequest;
import com.sospl.inventory.dto.auth.UserResponse;
import com.sospl.inventory.model.auth.SosUser;
import com.sospl.inventory.model.auth.SosUserRole;
import com.sospl.inventory.repository.auth.SosPermissionRepository;
import com.sospl.inventory.repository.auth.SosRolePermissionRepository;
import com.sospl.inventory.repository.auth.SosRoleRepository;
import com.sospl.inventory.repository.auth.SosUserRepository;
import com.sospl.inventory.repository.auth.SosUserRoleRepository;
import com.sospl.inventory.service.auth.SosUserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class SosUserServiceImpl implements SosUserService {

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
    private PasswordEncoder passwordEncoder;

    @Override
    public UserResponse getUserById(Long id) {
        SosUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserResponse(user);
    }

    @Override
    public UserResponse getUserByUsername(String username) {
        SosUser user = userRepository.findByUsernameAndIsDeletedFalse(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserResponse(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<UserResponse> responses = new ArrayList<>();
        userRepository.findAllByIsDeletedFalse()
                .forEach(user -> responses.add(mapToUserResponse(user)));
        return responses;
    }

    @Override
    public List<UserResponse> searchUsers(String keyword) {
        List<UserResponse> responses = new ArrayList<>();
        userRepository.searchUsers(keyword)
                .forEach(user -> responses.add(mapToUserResponse(user)));
        return responses;
    }

    @Override
    public UserResponse updateUser(Long id, RegisterRequest request, String updatedBy) {
        SosUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setUpdatedBy(updatedBy);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return mapToUserResponse(user);
    }

    @Override
    public void deleteUser(Long id, String deletedBy) {
        SosUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsDeleted(true);
        user.setDeletedBy(deletedBy);
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public void activateUser(Long id, String updatedBy) {
        SosUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(true);
        user.setUpdatedBy(updatedBy);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public void deactivateUser(Long id, String updatedBy) {
        SosUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        user.setUpdatedBy(updatedBy);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public void lockUser(Long id, String updatedBy) {
        SosUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsLocked(true);
        user.setUpdatedBy(updatedBy);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public void unlockUser(Long id, String updatedBy) {
        SosUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsLocked(false);
        user.setUpdatedBy(updatedBy);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public void assignRoleToUser(Long userId, Long roleId, String assignedBy) {
        if (userRoleRepository.existsByUserIdAndRoleIdAndIsDeletedFalse(userId, roleId)) {
            throw new RuntimeException("Role already assigned to user");
        }
        SosUserRole userRole = new SosUserRole();
        userRole.setUserId(userId);
        userRole.setRoleId(roleId);
        userRole.setIsActive(true);
        userRole.setIsDeleted(false);
        userRole.setCreatedBy(assignedBy);
        userRoleRepository.save(userRole);
    }

    @Override
    public void removeRoleFromUser(Long userId, Long roleId, String removedBy) {
        userRoleRepository.findByUserIdAndRoleIdAndIsDeletedFalse(userId, roleId)
                .ifPresent(userRole -> {
                    userRole.setIsDeleted(true);
                    userRole.setIsActive(false);
                    userRole.setDeletedBy(removedBy);
                    userRole.setDeletedAt(LocalDateTime.now());
                    userRoleRepository.save(userRole);
                });
    }

    // Helper mapper
    private UserResponse mapToUserResponse(SosUser user) {
        List<String> roles = new ArrayList<>();
        List<String> permissions = new ArrayList<>();

        userRoleRepository.findActiveRolesByUserId(user.getId()).forEach(userRole ->
                roleRepository.findById(userRole.getRoleId()).ifPresent(role -> {
                    roles.add(role.getRoleCode());
                    rolePermissionRepository.findActivePermissionsByRoleId(role.getId())
                            .forEach(rp -> permissionRepository.findById(rp.getPermissionId())
                                    .ifPresent(p -> permissions.add(p.getPermissionCode())));
                })
        );

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setIsActive(user.getIsActive());
        response.setIsLocked(user.getIsLocked());
        response.setLastLogin(user.getLastLogin());
        response.setRoles(roles);
        response.setPermissions(permissions);
        response.setCreatedBy(user.getCreatedBy());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedBy(user.getUpdatedBy());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }
}