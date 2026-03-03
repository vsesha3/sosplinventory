package com.sospl.inventory.repository.inventory.master;

import com.sospl.inventory.model.inventory.master.SosRmGroupMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SosRmGroupMasterRepository
        extends JpaRepository<SosRmGroupMaster, Long> {

    Optional<SosRmGroupMaster> findByRmGroupId(Integer rmGroupId);

    boolean existsByRmGroupId(Integer rmGroupId);

    boolean existsByRmGroupNameIgnoreCase(String rmGroupName);
}