package com.sospl.inventory.repository.auth;

import com.sospl.inventory.model.auth.SosRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosRoleRepository extends JpaRepository<SosRole, Long> {

    Optional<SosRole> findByRoleCode(String roleCode);

    Optional<SosRole> findByRoleName(String roleName);

    Optional<SosRole> findByRoleCodeAndIsDeletedFalse(String roleCode);

    Boolean existsByRoleCode(String roleCode);

    Boolean existsByRoleName(String roleName);

    List<SosRole> findAllByIsDeletedFalse();

    List<SosRole> findAllByIsActiveTrueAndIsDeletedFalse();
}