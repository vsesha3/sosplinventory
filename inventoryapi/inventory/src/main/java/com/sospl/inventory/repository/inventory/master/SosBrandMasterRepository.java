package com.sospl.inventory.repository.inventory.master;


import com.sospl.inventory.model.inventory.master.SosBrandMaster;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;


@Repository
public interface SosBrandMasterRepository extends JpaRepository<SosBrandMaster, Long> {

    List<SosBrandMaster> findAllByIsDeletedFalse();

    List<SosBrandMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosBrandMaster> findByBrandIdAndIsDeletedFalse(Integer brandId);

    Boolean existsByBrandId(Integer brandId);

    Boolean existsByBrandNameIgnoreCaseAndIsDeletedFalse(String brandName);

    List<SosBrandMaster> findByBrandNameContainingIgnoreCaseAndIsDeletedFalse(String keyword);
}