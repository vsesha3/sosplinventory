package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.model.inventory.master.SosProductMaster;
import com.sospl.inventory.repository.inventory.master.SosProductMasterRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.inventory.master.SosProductMasterService;
import org.springframework.stereotype.Service;

@Service
public class SosProductMasterServiceImpl
        extends BaseMasterServiceImpl<SosProductMaster, Long>
        implements SosProductMasterService {

    public SosProductMasterServiceImpl(SosProductMasterRepository repository) {
        super(repository);
    }
}
