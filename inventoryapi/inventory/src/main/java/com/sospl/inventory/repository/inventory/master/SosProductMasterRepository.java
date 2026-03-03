package com.sospl.inventory.repository.inventory.master;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



import java.util.List;
import java.util.Optional;

import com.sospl.inventory.model.inventory.master.SosProductMaster;


@Repository
public interface SosProductMasterRepository extends JpaRepository<SosProductMaster, Long> {

    List<SosProductMaster> findAllByIsDeletedFalse();

    List<SosProductMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosProductMaster> findByProductIdAndIsDeletedFalse(Integer productId);

    Boolean existsByProductId(Integer productId);

    Boolean existsByProductNameIgnoreCaseAndIsDeletedFalse(String productName);

    List<SosProductMaster> findByProductNameContainingIgnoreCaseAndIsDeletedFalse(String keyword);
}
