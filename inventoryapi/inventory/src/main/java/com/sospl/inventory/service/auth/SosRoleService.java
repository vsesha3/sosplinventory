package com.sospl.inventory.service.auth;

import com.sospl.inventory.dto.auth.RoleRequest;
import com.sospl.inventory.dto.auth.RoleResponse;

import java.util.List;

public interface SosRoleService {

    RoleResponse createRole(RoleRequest request, String createdBy);

    RoleResponse getRoleById(Long id);

    RoleResponse getRoleByCode(String roleCode);

    List<RoleResponse> getAllRoles();

    RoleResponse updateRole(Long id, RoleRequest request, String updatedBy);

    void deleteRole(Long id, String deletedBy);

    void assignPermissionToRole(Long roleId, Long permissionId, String assignedBy);

    void removePermissionFromRole(Long roleId, Long permissionId, String removedBy);
}