package com.sospl.inventory.service.auth.impl;

import com.sospl.inventory.dto.auth.PermissionRequest;
import com.sospl.inventory.dto.auth.PermissionResponse;
import com.sospl.inventory.model.auth.SosPermission;
import com.sospl.inventory.repository.auth.SosPermissionRepository;
import com.sospl.inventory.service.auth.SosPermissionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class SosPermissionServiceImpl implements SosPermissionService {

    @Autowired
    private SosPermissionRepository permissionRepository;

    @Override
    public PermissionResponse createPermission(PermissionRequest request,
                                                String createdBy) {
        if (permissionRepository.existsByPermissionCode(
                request.getPermissionCode())) {
            throw new RuntimeException("Permission code already exists");
        }

        SosPermission permission = new SosPermission();
        permission.setPermissionName(request.getPermissionName());
        permission.setPermissionCode(request.getPermissionCode());
        permission.setModule(request.getModule());
        permission.setDescription(request.getDescription());
        permission.setIsActive(true);
        permission.setIsDeleted(false);
        permission.setCreatedBy(createdBy);
        permissionRepository.save(permission);

        return mapToPermissionResponse(permission);
    }

    @Override
    public PermissionResponse getPermissionById(Long id) {
        SosPermission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found"));
        return mapToPermissionResponse(permission);
    }

    @Override
    public PermissionResponse getPermissionByCode(String permissionCode) {
        SosPermission permission = permissionRepository
                .findByPermissionCode(permissionCode)
                .orElseThrow(() -> new RuntimeException("Permission not found"));
        return mapToPermissionResponse(permission);
    }

    @Override
    public List<PermissionResponse> getAllPermissions() {
        List<PermissionResponse> responses = new ArrayList<>();
        permissionRepository.findAllByIsDeletedFalse()
                .forEach(permission ->
                        responses.add(mapToPermissionResponse(permission)));
        return responses;
    }

    @Override
    public List<PermissionResponse> getPermissionsByModule(String module) {
        List<PermissionResponse> responses = new ArrayList<>();
        permissionRepository.findAllByModuleAndIsDeletedFalse(module)
                .forEach(permission ->
                        responses.add(mapToPermissionResponse(permission)));
        return responses;
    }

    @Override
    public PermissionResponse updatePermission(Long id,
                                                PermissionRequest request,
                                                String updatedBy) {
        SosPermission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        permission.setPermissionName(request.getPermissionName());
        permission.setModule(request.getModule());
        permission.setDescription(request.getDescription());
        permission.setUpdatedBy(updatedBy);
        permission.setUpdatedAt(LocalDateTime.now());
        permissionRepository.save(permission);

        return mapToPermissionResponse(permission);
    }

    @Override
    public void deletePermission(Long id, String deletedBy) {
        SosPermission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        permission.setIsDeleted(true);
        permission.setDeletedBy(deletedBy);
        permission.setDeletedAt(LocalDateTime.now());
        permissionRepository.save(permission);
    }

    // Helper mapper
    private PermissionResponse mapToPermissionResponse(SosPermission permission) {
        PermissionResponse response = new PermissionResponse();
        response.setId(permission.getId());
        response.setPermissionName(permission.getPermissionName());
        response.setPermissionCode(permission.getPermissionCode());
        response.setModule(permission.getModule());
        response.setDescription(permission.getDescription());
        response.setIsActive(permission.getIsActive());
        response.setCreatedBy(permission.getCreatedBy());
        response.setCreatedAt(permission.getCreatedAt());
        response.setUpdatedBy(permission.getUpdatedBy());
        response.setUpdatedAt(permission.getUpdatedAt());
        return response;
    }
}