package com.sospl.inventory.repository.auth;

import com.sospl.inventory.model.auth.SosUserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosUserRoleRepository extends JpaRepository<SosUserRole, Long> {

    List<SosUserRole> findAllByUserId(Long userId);

    List<SosUserRole> findAllByUserIdAndIsDeletedFalse(Long userId);

    List<SosUserRole> findAllByRoleId(Long roleId);

    Optional<SosUserRole> findByUserIdAndRoleIdAndIsDeletedFalse(Long userId, Long roleId);

    Boolean existsByUserIdAndRoleIdAndIsDeletedFalse(Long userId, Long roleId);

    @Query("SELECT ur FROM SosUserRole ur WHERE ur.userId = :userId " +
           "AND ur.isActive = true AND ur.isDeleted = false")
    List<SosUserRole> findActiveRolesByUserId(@Param("userId") Long userId);
}