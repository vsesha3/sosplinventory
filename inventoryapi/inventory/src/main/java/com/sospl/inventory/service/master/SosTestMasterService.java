package com.sospl.inventory.service.master;

import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.model.master.SosTestMaster;
import com.sospl.inventory.service.common.BaseMasterService;

import java.util.List;

public interface SosTestMasterService
        extends BaseMasterService<SosTestMaster, Long> {

    List<SosTestMaster> findAllActive();

    PagedResponse<SosTestMaster> findAllActivePaginated(
            int page, int size, String sortBy, String sortDir);

    PagedResponse<SosTestMaster> search(
            String keyword, int page, int size,
            String sortBy, String sortDir);

	List<DropDownResponse> findAllForDropDown();
}