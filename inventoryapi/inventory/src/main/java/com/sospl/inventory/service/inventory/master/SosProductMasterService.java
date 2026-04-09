package com.sospl.inventory.service.inventory.master;

import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosProductMasterResponse;
import com.sospl.inventory.model.inventory.master.SosProductMaster;

import java.util.List;
import java.util.Optional;

public interface SosProductMasterService {

    SosProductMaster save(SosProductMaster entity);

    SosProductMaster update(Long id, SosProductMaster entity);

    Optional<SosProductMaster> findById(Long id);

    List<SosProductMaster> findAll();

    void delete(Long id);

    // With details
    List<SosProductMasterResponse> findAllWithDetails();

    // Paginated
    PagedResponse<SosProductMasterResponse> findAllPaginated(
            int page, int size, String sortBy, String sortDir);

    // Search paginated
    PagedResponse<SosProductMasterResponse> search(
            String keyword, int page, int size,
            String sortBy, String sortDir);
    
    List<DropDownResponse> findAllForDropDown();
    
}