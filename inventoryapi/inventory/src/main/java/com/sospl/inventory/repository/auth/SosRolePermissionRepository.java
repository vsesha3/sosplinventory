package com.sospl.inventory.repository.auth;

import com.sospl.inventory.model.auth.SosRolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosRolePermissionRepository extends JpaRepository<SosRolePermission, Long> {

    List<SosRolePermission> findAllByRoleId(Long roleId);

    List<SosRolePermission> findAllByRoleIdAndIsDeletedFalse(Long roleId);

    Optional<SosRolePermission> findByRoleIdAndPermissionIdAndIsDeletedFalse(Long roleId, Long permissionId);

    Boolean existsByRoleIdAndPermissionIdAndIsDeletedFalse(Long roleId, Long permissionId);

    @Query("SELECT rp FROM SosRolePermission rp WHERE rp.roleId = :roleId " +
           "AND rp.isActive = true AND rp.isDeleted = false")
    List<SosRolePermission> findActivePermissionsByRoleId(@Param("roleId") Long roleId);
}