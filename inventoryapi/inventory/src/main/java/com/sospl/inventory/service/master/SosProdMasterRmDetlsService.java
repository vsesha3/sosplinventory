package com.sospl.inventory.service.master;

import com.sospl.inventory.dto.master.SosProdMasterRmDetlsResponse;
import com.sospl.inventory.model.master.SosProdMasterRmDetls;
import com.sospl.inventory.service.common.BaseMasterService;

import java.math.BigDecimal;
import java.util.List;

public interface SosProdMasterRmDetlsService
        extends BaseMasterService<SosProdMasterRmDetls, Long> {

    // ── Fetch ─────────────────────────────────────────────────────────────
    List<SosProdMasterRmDetls> findByProductId(Long productId);

    List<SosProdMasterRmDetls> findByRmId(Long rmId);

    List<SosProdMasterRmDetls> findAllActive();

    // ── Fetch RM details for WO with qty calculation ──────────────────────
    List<SosProdMasterRmDetlsResponse> fetchRMdetailsForWOID(
            Long woId, BigDecimal qty);

    // ── Soft Delete ───────────────────────────────────────────────────────
    void softDelete(Long id, String deletedBy);
}