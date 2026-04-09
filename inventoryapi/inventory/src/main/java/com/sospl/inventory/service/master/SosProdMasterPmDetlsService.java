package com.sospl.inventory.service.master;

import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.model.master.SosProdMasterPmDetls;
import com.sospl.inventory.service.common.BaseMasterService;

import java.util.List;

public interface SosProdMasterPmDetlsService
        extends BaseMasterService<SosProdMasterPmDetls, Long> {

    List<SosProdMasterPmDetls> findByProductId(Long productId);

    List<SosProdMasterPmDetls> findByPmId(Long pmId);

    List<SosProdMasterPmDetls> findByProductIdAndPmId(
            Long productId, Long pmId);

    List<SosProdMasterPmDetls> findAllActive();

    void softDelete(Long id, String deletedBy);
    
    List<DropDownResponse> findAllForDropDown();
}