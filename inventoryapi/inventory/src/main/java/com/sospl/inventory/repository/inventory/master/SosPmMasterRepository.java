package com.sospl.inventory.repository.inventory.master;

import com.sospl.inventory.model.inventory.master.SosPmMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



import java.util.List;
import java.util.Optional;

@Repository
public interface SosPmMasterRepository extends JpaRepository<SosPmMaster, Long> {

    List<SosPmMaster> findAllByIsDeletedFalse();

    List<SosPmMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosPmMaster> findByPmIdAndIsDeletedFalse(Integer pmId);

    Boolean existsByPmId(Integer pmId);

    Boolean existsByPmNameIgnoreCaseAndIsDeletedFalse(String pmName);

    List<SosPmMaster> findByPmNameContainingIgnoreCaseAndIsDeletedFalse(String keyword);
}