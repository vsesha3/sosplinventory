package com.sospl.inventory.mapper.inventory.master;

import com.sospl.inventory.dto.inventory.master.SosRmMasterRequest;
import com.sospl.inventory.model.inventory.master.SosRmMaster;

public class SosRmMasterMapper {

    private SosRmMasterMapper() {
    }

    // ============================================
    // Request DTO → Entity
    // ============================================

    public static SosRmMaster toEntity(SosRmMasterRequest request) {

        SosRmMaster entity = new SosRmMaster();

        entity.setRmCode(request.getRmCode());
        entity.setRmName(request.getRmName());
        entity.setUomId(request.getUomId());
        entity.setRmGroupId(request.getRmGroupId());
        entity.setTestId(request.getTestId());
       
        
        entity.setAvgRate(request.getAvgRate());
        entity.setPackSize(request.getPackSize());
        entity.setCapacity(request.getCapacity());
        entity.setPackUom(request.getPackUom());

        return entity;
    }
}