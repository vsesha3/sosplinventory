package com.sospl.inventory.repository;

import com.sospl.inventory.model.SosVesselMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SosVesselMasterRepository
        extends JpaRepository<SosVesselMaster, Long> {

    List<SosVesselMaster> findAllByIsActiveTrueAndIsDeletedFalse();
}