package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.model.inventory.master.SosPmMaster;
import com.sospl.inventory.repository.inventory.master.SosPmMasterRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.inventory.master.SosPmMasterService;
import org.springframework.stereotype.Service;

@Service
public class SosPmMasterServiceImpl
        extends BaseMasterServiceImpl<SosPmMaster, Long>
        implements SosPmMasterService {

    public SosPmMasterServiceImpl(SosPmMasterRepository repository) {
        super(repository);
    }
}
