package com.sospl.inventory.service.impl;

import com.sospl.inventory.dto.SosProductionPlanResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.mapper.SosProductionPlanMapper;
import com.sospl.inventory.model.SosProductionPlan;
import com.sospl.inventory.repository.inventory.SosProductionPlanRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.SosProductionPlanService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SosProductionPlanServiceImpl
        extends BaseMasterServiceImpl<SosProductionPlan, Long>
        implements SosProductionPlanService {

    private static final Logger log =
            LoggerFactory.getLogger(SosProductionPlanServiceImpl.class);

    private final SosProductionPlanRepository planRepository;
    private final SosProductionPlanMapper planMapper;

    public SosProductionPlanServiceImpl(
            SosProductionPlanRepository repository,
            SosProductionPlanMapper planMapper) {
        super(repository);
        this.planRepository = repository;
        this.planMapper     = planMapper;
    }

    // ── With details ──────────────────────────────────────────────────────

   

    @Override
    public PagedResponse<SosProductionPlanResponse> findAllWithDetails(
            int page, int size) {

        List<Object[]> allRows = planRepository
                .findCurrentAndFuturePlans();

        // Manual pagination on the result list
        int totalElements = allRows.size();
        int totalPages    = (int) Math.ceil((double) totalElements / size);
        int fromIndex     = page * size;
        int toIndex       = Math.min(fromIndex + size, totalElements);

        List<SosProductionPlanResponse> content =
                fromIndex >= totalElements
                        ? java.util.Collections.emptyList()
                        : planMapper.mapRows(
                                allRows.subList(fromIndex, toIndex));

        return new PagedResponse<>(
                content,
                page,
                size,
                totalElements,
                totalPages,
                page == 0,
                page >= totalPages - 1);
    }
    // ── Basic fetch ───────────────────────────────────────────────────────

    @Override
    public List<SosProductionPlan> findAllActive() {
        return planRepository
                .findAllByIsActiveTrueAndIsDeletedFalse();
    }

    @Override
    public Page<SosProductionPlan> findAllActivePaginated(
            Pageable pageable) {
        return planRepository
                .findAllByIsActiveTrueAndIsDeletedFalse(pageable);
    }

    @Override
    public List<SosProductionPlan> findByWoId(Long woId) {
        return planRepository
                .findAllByWoIdAndIsDeletedFalse(woId);
    }

    @Override
    public List<SosProductionPlan> findByVesselId(Long vesselId) {
        return planRepository
                .findAllByVesselIdAndIsDeletedFalse(vesselId);
    }

    @Override
    public Page<SosProductionPlan> search(
            String keyword, Pageable pageable) {
        return planRepository.search(keyword, pageable);
    }

    // ── Soft Delete ───────────────────────────────────────────────────────

    @Override
    public void softDelete(Long id, String deletedBy) {
        SosProductionPlan existing = planRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Production plan not found: " + id));
        existing.setIsDeleted(true);
        existing.setIsActive(false);
        existing.setDeletedBy(deletedBy);
        existing.setDeletedAt(LocalDateTime.now());
        planRepository.save(existing);
        log.info("Production plan soft deleted — id: {}", id);
    }

	@Override
	public List<SosProductionPlanResponse> findAllWithDetailsByWoId(Long woId) {
		// TODO Auto-generated method stub
		return null;
	}
}