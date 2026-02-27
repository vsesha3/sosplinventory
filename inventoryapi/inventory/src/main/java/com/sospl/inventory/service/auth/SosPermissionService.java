package com.sospl.inventory.service.auth;

import com.sospl.inventory.dto.auth.PermissionRequest;
import com.sospl.inventory.dto.auth.PermissionResponse;

import java.util.List;

public interface SosPermissionService {

    PermissionResponse createPermission(PermissionRequest request, String createdBy);

    PermissionResponse getPermissionById(Long id);

    PermissionResponse getPermissionByCode(String permissionCode);

    List<PermissionResponse> getAllPermissions();

    List<PermissionResponse> getPermissionsByModule(String module);

    PermissionResponse updatePermission(Long id, PermissionRequest request, String updatedBy);

    void deletePermission(Long id, String deletedBy);
}