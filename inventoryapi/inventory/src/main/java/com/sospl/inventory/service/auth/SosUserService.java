package com.sospl.inventory.service.auth;

import com.sospl.inventory.dto.auth.UserResponse;
import com.sospl.inventory.dto.auth.RegisterRequest;

import java.util.List;

public interface SosUserService {

    UserResponse getUserById(Long id);

    UserResponse getUserByUsername(String username);

    List<UserResponse> getAllUsers();

    List<UserResponse> searchUsers(String keyword);

    UserResponse updateUser(Long id, RegisterRequest request, String updatedBy);

    void deleteUser(Long id, String deletedBy);

    void activateUser(Long id, String updatedBy);

    void deactivateUser(Long id, String updatedBy);

    void lockUser(Long id, String updatedBy);

    void unlockUser(Long id, String updatedBy);

    void assignRoleToUser(Long userId, Long roleId, String assignedBy);

    void removeRoleFromUser(Long userId, Long roleId, String removedBy);
}