package com.sospl.inventory.repository.inventory.master;

import com.sospl.inventory.model.inventory.master.SosAreaMaster;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosAreaMasterRepository extends JpaRepository<SosAreaMaster, Long> {

    List<SosAreaMaster> findAllByIsDeletedFalse();

    List<SosAreaMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosAreaMaster> findByAreaIdAndIsDeletedFalse(Integer areaId);

    Boolean existsByAreaId(Integer areaId);

    Boolean existsByAreaNameIgnoreCaseAndIsDeletedFalse(String areaName);

    List<SosAreaMaster> findByAreaNameContainingIgnoreCaseAndIsDeletedFalse(String keyword);
}