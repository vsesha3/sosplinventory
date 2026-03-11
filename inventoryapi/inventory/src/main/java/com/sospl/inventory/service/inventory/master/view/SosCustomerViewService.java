package com.sospl.inventory.service.inventory.master.view;

import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosCustomerMasterVResponse;

public interface SosCustomerViewService {

    SosCustomerMasterVResponse findById(Long customerId);

    PagedResponse<SosCustomerMasterVResponse> findAllPaginated(
            int page, int size, String sortBy, String sortDir);

    PagedResponse<SosCustomerMasterVResponse> findAllActivePaginated(
            int page, int size, String sortBy, String sortDir);

    PagedResponse<SosCustomerMasterVResponse> search(
            String keyword, int page, int size,
            String sortBy, String sortDir);
}