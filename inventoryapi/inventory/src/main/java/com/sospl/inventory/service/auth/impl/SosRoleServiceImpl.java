package com.sospl.inventory.service.auth.impl;

import com.sospl.inventory.dto.auth.RoleRequest;
import com.sospl.inventory.dto.auth.RoleResponse;
import com.sospl.inventory.model.auth.SosRole;
import com.sospl.inventory.model.auth.SosRolePermission;
import com.sospl.inventory.repository.auth.SosPermissionRepository;
import com.sospl.inventory.repository.auth.SosRolePermissionRepository;
import com.sospl.inventory.repository.auth.SosRoleRepository;
import com.sospl.inventory.service.auth.SosRoleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class SosRoleServiceImpl implements SosRoleService {

    @Autowired
    private SosRoleRepository roleRepository;

    @Autowired
    private SosRolePermissionRepository rolePermissionRepository;

    @Autowired
    private SosPermissionRepository permissionRepository;

    @Override
    public RoleResponse createRole(RoleRequest request, String createdBy) {
        if (roleRepository.existsByRoleCode(request.getRoleCode())) {
            throw new RuntimeException("Role code already exists");
        }
        SosRole role = new SosRole();
        role.setRoleName(request.getRoleName());
        role.setRoleCode(request.getRoleCode());
        role.setDescription(request.getDescription());
        role.setIsActive(true);
        role.setIsDeleted(false);
        role.setCreatedBy(createdBy);
        roleRepository.save(role);
        return mapToRoleResponse(role);
    }

    @Override
    public RoleResponse getRoleById(Long id) {
        SosRole role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        return mapToRoleResponse(role);
    }

    @Override
    public RoleResponse getRoleByCode(String roleCode) {
        SosRole role = roleRepository.findByRoleCodeAndIsDeletedFalse(roleCode)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        return mapToRoleResponse(role);
    }

    @Override
    public List<RoleResponse> getAllRoles() {
        List<RoleResponse> responses = new ArrayList<>();
        roleRepository.findAllByIsDeletedFalse()
                .forEach(role -> responses.add(mapToRoleResponse(role)));
        return responses;
    }

    @Override
    public RoleResponse updateRole(Long id, RoleRequest request, String updatedBy) {
        SosRole role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        role.setRoleName(request.getRoleName());
        role.setDescription(request.getDescription());
        role.setUpdatedBy(updatedBy);
        role.setUpdatedAt(LocalDateTime.now());
        roleRepository.save(role);
        return mapToRoleResponse(role);
    }

    @Override
    public void deleteRole(Long id, String deletedBy) {
        SosRole role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        role.setIsDeleted(true);
        role.setDeletedBy(deletedBy);
        role.setDeletedAt(LocalDateTime.now());
        roleRepository.save(role);
    }

    @Override
    public void assignPermissionToRole(Long roleId, Long permissionId, String assignedBy) {
        if (rolePermissionRepository.existsByRoleIdAndPermissionIdAndIsDeletedFalse(roleId, permissionId)) {
            throw new RuntimeException("Permission already assigned to role");
        }
        SosRolePermission rp = new SosRolePermission();
        rp.setRoleId(roleId);
        rp.setPermissionId(permissionId);
        rp.setIsActive(true);
        rp.setIsDeleted(false);
        rp.setCreatedBy(assignedBy);
        rolePermissionRepository.save(rp);
    }

    @Override
    public void removePermissionFromRole(Long roleId, Long permissionId, String removedBy) {
        rolePermissionRepository
                .findByRoleIdAndPermissionIdAndIsDeletedFalse(roleId, permissionId)
                .ifPresent(rp -> {
                    rp.setIsDeleted(true);
                    rp.setIsActive(false);
                    rp.setDeletedBy(removedBy);
                    rp.setDeletedAt(LocalDateTime.now());
                    rolePermissionRepository.save(rp);
                });
    }

    // Helper mapper
    private RoleResponse mapToRoleResponse(SosRole role) {
        List<String> permissions = new ArrayList<>();
        rolePermissionRepository.findActivePermissionsByRoleId(role.getId())
                .forEach(rp -> permissionRepository.findById(rp.getPermissionId())
                        .ifPresent(p -> permissions.add(p.getPermissionCode())));

        RoleResponse response = new RoleResponse();
        response.setId(role.getId());
        response.setRoleName(role.getRoleName());
        response.setRoleCode(role.getRoleCode());
        response.setDescription(role.getDescription());
        response.setIsActive(role.getIsActive());
        response.setPermissions(permissions);
        response.setCreatedBy(role.getCreatedBy());
        response.setCreatedAt(role.getCreatedAt());
        response.setUpdatedBy(role.getUpdatedBy());
        response.setUpdatedAt(role.getUpdatedAt());
        return response;
    }
}