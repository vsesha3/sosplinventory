package com.sospl.inventory.service.inventory.master;

import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosPmMasterResponse;
import com.sospl.inventory.model.inventory.master.SosPmMaster;

import java.util.List;
import java.util.Optional;

public interface SosPmMasterService {

    SosPmMaster save(SosPmMaster entity);

    SosPmMaster update(Integer id, SosPmMaster entity);

    Optional<SosPmMaster> findById(Integer id);

    List<SosPmMaster> findAll();

    void delete(Integer id);

    List<SosPmMasterResponse> findAllWithDetails();

    PagedResponse<SosPmMasterResponse> findAllPaginated(
            int page, int size, String sortBy, String sortDir);

    PagedResponse<SosPmMasterResponse> search(
            String keyword, int page, int size,
            String sortBy, String sortDir);
    
    List<SosPmMaster> findAllActiveForDropdown();
    List<DropDownResponse> findAllForDropDown();
}