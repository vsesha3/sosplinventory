package com.sospl.inventory.repository.inventory.master;

import com.sospl.inventory.model.inventory.master.SosTransporterMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosTransporterMasterRepository extends JpaRepository<SosTransporterMaster, Long> {

    List<SosTransporterMaster> findAllByIsDeletedFalse();

    List<SosTransporterMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosTransporterMaster> findByTransporterIdAndIsDeletedFalse(Integer transporterId);

    Boolean existsByTransporterId(Integer transporterId);

    Boolean existsByTransporterNameIgnoreCaseAndIsDeletedFalse(String transporterName);

    List<SosTransporterMaster> findByTransporterNameContainingIgnoreCaseAndIsDeletedFalse(String keyword);
}