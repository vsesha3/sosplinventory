package com.sospl.inventory.service;

import com.sospl.inventory.dto.SosProductionPlanResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.model.SosProductionPlan;
import com.sospl.inventory.service.common.BaseMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SosProductionPlanService
        extends BaseMasterService<SosProductionPlan, Long> {

    // ── Fetch with details ────────────────────────────────────────────────
    
    
    PagedResponse<SosProductionPlanResponse> findAllWithDetails(
            int page, int size);

    List<SosProductionPlanResponse> findAllWithDetailsByWoId(Long woId);

    // ── Basic fetch ───────────────────────────────────────────────────────
    List<SosProductionPlan> findAllActive();

    Page<SosProductionPlan> findAllActivePaginated(Pageable pageable);

    List<SosProductionPlan> findByWoId(Long woId);

    List<SosProductionPlan> findByVesselId(Long vesselId);

    Page<SosProductionPlan> search(String keyword, Pageable pageable);

    // ── Soft Delete ───────────────────────────────────────────────────────
    void softDelete(Long id, String deletedBy);
}