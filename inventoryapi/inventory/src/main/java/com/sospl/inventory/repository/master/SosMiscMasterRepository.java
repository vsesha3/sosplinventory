package com.sospl.inventory.repository.master;

import com.sospl.inventory.model.master.SosMiscMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosMiscMasterRepository
        extends JpaRepository<SosMiscMaster, Long> {

    List<SosMiscMaster> findByIsActive(Boolean isActive);

    Optional<SosMiscMaster> findByMiscCode(String miscCode);

    boolean existsByMiscCode(String miscCode);
}