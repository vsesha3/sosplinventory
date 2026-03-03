package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.model.inventory.master.SosQcTestMaster;
import com.sospl.inventory.repository.inventory.master.SosQcTestMasterRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.inventory.master.SosQcTestMasterService;
import org.springframework.stereotype.Service;

@Service
public class SosQcTestMasterServiceImpl
        extends BaseMasterServiceImpl<SosQcTestMaster, Long>
        implements SosQcTestMasterService {

    public SosQcTestMasterServiceImpl(SosQcTestMasterRepository repository) {
        super(repository);
    }
}
