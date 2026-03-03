package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.model.inventory.master.SosCapitalGoodsMaster;
import com.sospl.inventory.repository.inventory.master.SosCapitalGoodsMasterRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.inventory.master.SosCapitalGoodsMasterService;
import org.springframework.stereotype.Service;

@Service
public class SosCapitalGoodsMasterServiceImpl
        extends BaseMasterServiceImpl<SosCapitalGoodsMaster, Long>
        implements SosCapitalGoodsMasterService {

    public SosCapitalGoodsMasterServiceImpl(SosCapitalGoodsMasterRepository repository) {
        super(repository);
    }
}
