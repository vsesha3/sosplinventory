package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.model.inventory.master.SosProductGroupMaster;
import com.sospl.inventory.repository.inventory.master.SosProductGroupMasterRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.inventory.master.SosProductGroupMasterService;
import org.springframework.stereotype.Service;

@Service
public class SosProductGroupMasterServiceImpl
        extends BaseMasterServiceImpl<SosProductGroupMaster, Long>
        implements SosProductGroupMasterService {

    public SosProductGroupMasterServiceImpl(SosProductGroupMasterRepository repository) {
        super(repository);
    }
}
