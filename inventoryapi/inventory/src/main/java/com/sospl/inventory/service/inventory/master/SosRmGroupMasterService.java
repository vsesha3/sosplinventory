package com.sospl.inventory.service.inventory.master;

import com.sospl.inventory.model.inventory.master.SosRmGroupMaster;
import com.sospl.inventory.service.common.BaseMasterService;

import java.util.Optional;

public interface SosRmGroupMasterService
        extends BaseMasterService<SosRmGroupMaster, Long> {

    Optional<SosRmGroupMaster> findByRmGroupId(Integer rmGroupId);

    boolean existsByRmGroupId(Integer rmGroupId);

    boolean existsByRmGroupName(String rmGroupName);
}