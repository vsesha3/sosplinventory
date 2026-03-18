package com.sospl.inventory.service.inventory.master.view;



import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.dto.inventory.view.SosPurchaseOrderRequest;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosSupplierMasterVResponse;

import java.util.List;

public interface SosSupplierViewService {

    List<SosSupplierMasterVResponse> findAll();

    List<SosSupplierMasterVResponse> findAllActive();

    SosSupplierMasterVResponse findById(Long supplierId);

    PagedResponse<SosSupplierMasterVResponse> findAllPaginated(
            int page, int size, String sortBy, String sortDir);

    PagedResponse<SosSupplierMasterVResponse> findAllActivePaginated(
            int page, int size, String sortBy, String sortDir);

    PagedResponse<SosSupplierMasterVResponse> search(
            String keyword, int page, int size,
            String sortBy, String sortDir);

	List<DropDownResponse> findAllForDropDown();
}
