package com.sospl.inventory.repository.inventory.master;



import com.sospl.inventory.model.inventory.master.SosQcTestMaster;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



import java.util.List;
import java.util.Optional;


@Repository
public interface SosQcTestMasterRepository extends JpaRepository<SosQcTestMaster, Long> {

    List<SosQcTestMaster> findAllByIsDeletedFalse();

    List<SosQcTestMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosQcTestMaster> findByQcTestIdAndIsDeletedFalse(Integer qcTestId);

    Boolean existsByQcTestId(Integer qcTestId);

    Boolean existsByQcTestNameIgnoreCaseAndIsDeletedFalse(String qcTestName);

    List<SosQcTestMaster> findByQcTestNameContainingIgnoreCaseAndIsDeletedFalse(String keyword);
}