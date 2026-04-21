package com.sospl.inventory.service.rmrequest;

import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.rmrequest.SosRmRequestDto;
import com.sospl.inventory.dto.rmrequest.SosRmRequestViewResponse;
import com.sospl.inventory.model.rmrequest.SosRmRequest;
import com.sospl.inventory.model.rmrequest.SosRmRequestDetls;
import com.sospl.inventory.service.common.BaseMasterService;

import java.util.List;

public interface SosRmRequestService
        extends BaseMasterService<SosRmRequest, Long> {

    // ── Save header + lines ───────────────────────────────────────────────
    Long saveRmRequest(SosRmRequestDto request);

    // ── Fetch ─────────────────────────────────────────────────────────────
    List<SosRmRequest> findAllActive();

    List<SosRmRequest> findByWoId(Long woId);

    List<SosRmRequest> findByProductionPlanId(Long productionPlanId);

    List<SosRmRequest> findPendingRequests();

    List<SosRmRequestDetls> findLinesByRmReqId(Long rmReqId);

    // ── Soft Delete ───────────────────────────────────────────────────────
    void softDelete(Long id, String deletedBy);

    void softDeleteLine(Long lineId, String deletedBy);
    
    
    PagedResponse<SosRmRequestViewResponse> findAllRmRequestView(
            int page, int size);
}