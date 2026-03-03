package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.model.inventory.master.SosSubitemMaster;
import com.sospl.inventory.repository.inventory.master.SosSubitemMasterRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.inventory.master.SosSubitemMasterService;
import org.springframework.stereotype.Service;

@Service
public class SosSubitemMasterServiceImpl
        extends BaseMasterServiceImpl<SosSubitemMaster, Long>
        implements SosSubitemMasterService {

    public SosSubitemMasterServiceImpl(SosSubitemMasterRepository repository) {
        super(repository);
    }
}
