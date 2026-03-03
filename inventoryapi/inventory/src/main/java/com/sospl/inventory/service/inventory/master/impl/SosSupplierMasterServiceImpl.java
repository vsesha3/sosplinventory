package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.model.inventory.master.SosSupplierMaster;
import com.sospl.inventory.repository.inventory.master.SosSupplierMasterRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.inventory.master.SosSupplierMasterService;
import org.springframework.stereotype.Service;

@Service
public class SosSupplierMasterServiceImpl
        extends BaseMasterServiceImpl<SosSupplierMaster, Long>
        implements SosSupplierMasterService {

    public SosSupplierMasterServiceImpl(SosSupplierMasterRepository repository) {
        super(repository);
    }
}
