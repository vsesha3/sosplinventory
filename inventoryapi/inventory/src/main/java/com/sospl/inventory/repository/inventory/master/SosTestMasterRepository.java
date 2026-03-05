package com.sospl.inventory.repository.inventory.master;

import com.sospl.inventory.model.inventory.master.SosTestMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosTestMasterRepository extends JpaRepository<SosTestMaster, Long> {

    List<SosTestMaster> findAllByIsDeletedFalse();

    List<SosTestMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosTestMaster> findByTestIdAndIsDeletedFalse(Long testId);

    Optional<SosTestMaster> findByTestCodeAndIsDeletedFalse(String testCode);

    Boolean existsByTestId(Long testId);

    Boolean existsByTestCodeIgnoreCaseAndIsDeletedFalse(String testCode);

    Boolean existsByTestNameIgnoreCaseAndIsDeletedFalse(String testName);

    List<SosTestMaster> findByTestNameContainingIgnoreCaseAndIsDeletedFalse(String keyword);

    List<SosTestMaster> findByTestCodeContainingIgnoreCaseAndIsDeletedFalse(String keyword);
}