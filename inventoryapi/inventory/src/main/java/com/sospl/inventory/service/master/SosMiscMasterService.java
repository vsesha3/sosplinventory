package com.sospl.inventory.service.master;

import com.sospl.inventory.model.master.SosMiscMaster;

import java.util.List;

public interface SosMiscMasterService {

    List<SosMiscMaster> getAll();

    List<SosMiscMaster> getActive();

    SosMiscMaster getById(Long miscId);

    SosMiscMaster getByCode(String miscCode);

    SosMiscMaster save(SosMiscMaster miscMaster);

    SosMiscMaster update(Long miscId, SosMiscMaster miscMaster);

    void delete(Long miscId);
}