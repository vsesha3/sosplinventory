package com.sospl.inventory.repository.inventory.master;

import com.sospl.inventory.model.inventory.master.SosUomMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosUomMasterRepository extends JpaRepository<SosUomMaster, Long> {

    List<SosUomMaster> findAllByIsDeletedFalse();

    List<SosUomMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosUomMaster> findByUomIdAndIsDeletedFalse(Integer uomId);

    Boolean existsByUomId(Integer uomId);

    Boolean existsByUomNameIgnoreCaseAndIsDeletedFalse(String uomName);

    List<SosUomMaster> findByUomNameContainingIgnoreCaseAndIsDeletedFalse(String keyword);
}