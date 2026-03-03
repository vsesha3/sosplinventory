package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.model.inventory.master.SosAreaMaster;
import com.sospl.inventory.repository.inventory.master.SosAreaMasterRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.inventory.master.SosAreaMasterService;
import org.springframework.stereotype.Service;

@Service
public class SosAreaMasterServiceImpl
        extends BaseMasterServiceImpl<SosAreaMaster, Long>
        implements SosAreaMasterService {

    public SosAreaMasterServiceImpl(SosAreaMasterRepository repository) {
        super(repository);
    }
}
