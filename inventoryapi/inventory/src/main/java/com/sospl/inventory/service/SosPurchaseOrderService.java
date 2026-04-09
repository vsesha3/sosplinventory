package com.sospl.inventory.service;

import com.sospl.inventory.model.SosPurchaseOrder;
import com.sospl.inventory.service.common.BaseMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SosPurchaseOrderService
        extends BaseMasterService<SosPurchaseOrder, Long> {

    List<SosPurchaseOrder> findAllActive();

    Page<SosPurchaseOrder> findAllActivePaginated(Pageable pageable);

    SosPurchaseOrder findByPoNumber(String poNumber);

    List<SosPurchaseOrder> findByCompanyId(Long companyId);

    List<SosPurchaseOrder> findByPartialPoFlag(Boolean partialPoFlag);

    Page<SosPurchaseOrder> search(String keyword, Pageable pageable);

    List<SosPurchaseOrder> findAllForDropdown();

    void softDelete(Long poId, String deletedBy);
}