package com.sospl.inventory.repository.inventory.master;



import com.sospl.inventory.model.inventory.master.SosSubitemMaster;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface SosSubitemMasterRepository extends JpaRepository<SosSubitemMaster, Long> {

    List<SosSubitemMaster> findAllByIsDeletedFalse();

    List<SosSubitemMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosSubitemMaster> findBySubitemIdAndIsDeletedFalse(Integer subitemId);

    Boolean existsBySubitemId(Integer subitemId);

    Boolean existsBySubitemNameIgnoreCaseAndIsDeletedFalse(String subitemName);

    List<SosSubitemMaster> findBySubitemNameContainingIgnoreCaseAndIsDeletedFalse(String keyword);
}