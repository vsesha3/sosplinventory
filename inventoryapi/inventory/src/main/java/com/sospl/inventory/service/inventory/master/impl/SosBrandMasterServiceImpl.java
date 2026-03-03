package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.model.inventory.master.SosBrandMaster;
import com.sospl.inventory.repository.inventory.master.SosBrandMasterRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.inventory.master.SosBrandMasterService;
import org.springframework.stereotype.Service;

@Service
public class SosBrandMasterServiceImpl
        extends BaseMasterServiceImpl<SosBrandMaster, Long>
        implements SosBrandMasterService {

    public SosBrandMasterServiceImpl(SosBrandMasterRepository repository) {
        super(repository);
    }
}
