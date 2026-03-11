package com.sospl.inventory.service.inventory.master;

import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosCapitalGoodsMasterResponse;
import com.sospl.inventory.model.inventory.master.SosCapitalGoodsMaster;
import com.sospl.inventory.service.common.BaseMasterService;

import java.util.List;

public interface SosCapitalGoodsMasterService
        extends BaseMasterService<SosCapitalGoodsMaster, Long> {

    List<SosCapitalGoodsMasterResponse> findAllWithDetails();

    PagedResponse<SosCapitalGoodsMasterResponse> findAllWithDetailsPaginated(
            int page, int size, String sortBy, String sortDir);

    PagedResponse<SosCapitalGoodsMasterResponse> search(
            String keyword, int page, int size,
            String sortBy, String sortDir);
}