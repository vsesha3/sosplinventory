package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.model.inventory.master.SosUomMaster;
import com.sospl.inventory.repository.inventory.master.SosUomMasterRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.inventory.master.SosUomMasterService;
import org.springframework.stereotype.Service;

@Service
public class SosUomMasterServiceImpl
        extends BaseMasterServiceImpl<SosUomMaster, Long>
        implements SosUomMasterService {

    public SosUomMasterServiceImpl(SosUomMasterRepository repository) {
        super(repository);
    }
}
