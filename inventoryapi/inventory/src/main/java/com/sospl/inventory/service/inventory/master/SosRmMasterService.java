package com.sospl.inventory.service.inventory.master;

import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosRmMasterNativeResponse;
import com.sospl.inventory.dto.inventory.master.SosRmMasterRequest;
import com.sospl.inventory.dto.inventory.master.SosRmMasterResponse;
import com.sospl.inventory.model.inventory.master.SosRmMaster;

import java.util.List;
import java.util.Optional;

public interface SosRmMasterService {

    SosRmMasterResponse create(SosRmMasterRequest request);

    SosRmMasterResponse update(Integer id, SosRmMasterRequest request);

    List<SosRmMasterResponse> findAll();

    SosRmMasterResponse findById(Integer id);

    void delete(Integer id);

    PagedResponse<SosRmMasterResponse> findAllPaginated(
            int page, int size, String sortBy, String sortDir);

    PagedResponse<SosRmMasterResponse> search(
            String keyword, int page, int size,
            String sortBy, String sortDir);

    // ← Changed to NativeResponse
    List<SosRmMasterNativeResponse> findAllActiveWithDetails();

    PagedResponse<SosRmMasterNativeResponse> findAllActiveWithDetailsPaginated(
            int page, int size, String sortBy, String sortDir);

    PagedResponse<SosRmMasterNativeResponse> searchActiveWithDetails(
            String keyword, int page, int size,
            String sortBy, String sortDir);
    
    List<DropDownResponse> findAllForDropDown();
    
    List<SosRmMasterResponse> findAllActiveWithDetailsLong();

	
	SosRmMaster findByRmCode(Integer code);
	
    
    
}