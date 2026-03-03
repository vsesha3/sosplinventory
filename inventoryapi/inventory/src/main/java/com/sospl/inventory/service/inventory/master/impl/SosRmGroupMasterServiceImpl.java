package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.model.inventory.master.SosRmGroupMaster;
import com.sospl.inventory.repository.inventory.master.SosRmGroupMasterRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.inventory.master.SosRmGroupMasterService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SosRmGroupMasterServiceImpl
        extends BaseMasterServiceImpl<SosRmGroupMaster, Long>
        implements SosRmGroupMasterService {

    private final SosRmGroupMasterRepository repository;

    public SosRmGroupMasterServiceImpl(SosRmGroupMasterRepository repository) {
        super(repository);
        this.repository = repository;
    }

    @Override
    public Optional<SosRmGroupMaster> findByRmGroupId(Integer rmGroupId) {
        return repository.findByRmGroupId(rmGroupId);
    }

    @Override
    public boolean existsByRmGroupId(Integer rmGroupId) {
        return repository.existsByRmGroupId(rmGroupId);
    }

    @Override
    public boolean existsByRmGroupName(String rmGroupName) {
        return repository.existsByRmGroupNameIgnoreCase(rmGroupName);
    }
}