package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.model.inventory.master.SosCustomerMaster;
import com.sospl.inventory.repository.inventory.master.SosCustomerMasterRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.inventory.master.SosCustomerMasterService;
import org.springframework.stereotype.Service;

@Service
public class SosCustomerMasterServiceImpl
        extends BaseMasterServiceImpl<SosCustomerMaster, Long>
        implements SosCustomerMasterService {

    public SosCustomerMasterServiceImpl(SosCustomerMasterRepository repository) {
        super(repository);
    }
}
