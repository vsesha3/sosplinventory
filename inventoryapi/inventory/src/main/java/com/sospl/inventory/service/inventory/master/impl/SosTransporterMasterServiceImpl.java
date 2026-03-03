package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.model.inventory.master.SosTransporterMaster;
import com.sospl.inventory.repository.inventory.master.SosTransporterMasterRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.inventory.master.SosTransporterMasterService;
import org.springframework.stereotype.Service;

@Service
public class SosTransporterMasterServiceImpl
        extends BaseMasterServiceImpl<SosTransporterMaster, Long>
        implements SosTransporterMasterService {

    public SosTransporterMasterServiceImpl(SosTransporterMasterRepository repository) {
        super(repository);
    }
}
