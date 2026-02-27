package com.sospl.inventory.repository.auth;

import com.sospl.inventory.model.auth.SosPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosPermissionRepository extends JpaRepository<SosPermission, Long> {

    Optional<SosPermission> findByPermissionCode(String permissionCode);

    Optional<SosPermission> findByPermissionName(String permissionName);

    Boolean existsByPermissionCode(String permissionCode);

    List<SosPermission> findAllByIsDeletedFalse();

    List<SosPermission> findAllByIsActiveTrueAndIsDeletedFalse();

    List<SosPermission> findAllByModuleAndIsDeletedFalse(String module);
}