package com.sospl.inventory.repository.inventory.master;

import com.sospl.inventory.model.inventory.master.SosProductGroupMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosProductGroupMasterRepository
        extends JpaRepository<SosProductGroupMaster, Long> {

    @Query("SELECT p FROM SosProductGroupMaster p WHERE p.isDeleted = false")
    List<SosProductGroupMaster> findAllByIsDeletedFalse();

    @Query("SELECT p FROM SosProductGroupMaster p WHERE p.isActive = true AND p.isDeleted = false")
    List<SosProductGroupMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    @Query("SELECT p FROM SosProductGroupMaster p WHERE p.productGroupId = :productGroupId AND p.isDeleted = false")
    Optional<SosProductGroupMaster> findByProductGroupId(@Param("productGroupId") Integer productGroupId);

    @Query("SELECT p FROM SosProductGroupMaster p WHERE p.chHeadNo = :chHeadNo AND p.isDeleted = false")
    List<SosProductGroupMaster> findAllByChHeadNo(@Param("chHeadNo") Integer chHeadNo);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM SosProductGroupMaster p WHERE p.productGroupId = :productGroupId")
    Boolean existsByProductGroupId(@Param("productGroupId") Integer productGroupId);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM SosProductGroupMaster p WHERE p.groupName = :groupName AND p.isDeleted = false")
    Boolean existsByGroupName(@Param("groupName") String groupName);

    @Query("SELECT p FROM SosProductGroupMaster p WHERE p.isDeleted = false AND " +
           "LOWER(p.groupName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<SosProductGroupMaster> searchByGroupName(@Param("keyword") String keyword);
}