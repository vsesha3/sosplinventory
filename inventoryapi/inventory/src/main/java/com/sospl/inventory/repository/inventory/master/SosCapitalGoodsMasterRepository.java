package com.sospl.inventory.repository.inventory.master;


import com.sospl.inventory.model.inventory.master.SosCapitalGoodsMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



import java.util.List;
import java.util.Optional;

@Repository
public interface SosCapitalGoodsMasterRepository extends JpaRepository<SosCapitalGoodsMaster, Long> {

    List<SosCapitalGoodsMaster> findAllByIsDeletedFalse();

    List<SosCapitalGoodsMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosCapitalGoodsMaster> findByCgIdAndIsDeletedFalse(Integer cgId);

    Boolean existsByCgId(Integer cgId);

    Boolean existsByCgNameIgnoreCaseAndIsDeletedFalse(String cgName);

    List<SosCapitalGoodsMaster> findByCgNameContainingIgnoreCaseAndIsDeletedFalse(String keyword);
}