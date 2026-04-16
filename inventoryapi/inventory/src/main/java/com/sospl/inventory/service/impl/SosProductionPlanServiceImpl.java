package com.sospl.inventory.service.impl;

import com.sospl.inventory.dto.SosProductionPlanResponse;
import com.sospl.inventory.dto.SosProductionPlanSummaryResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.mapper.SosProductionPlanMapper;
import com.sospl.inventory.model.SosProductionPlan;
import com.sospl.inventory.repository.SosProductionPlanRepository;
import com.sospl.inventory.repository.SosWorkOrderRepository;
import com.sospl.inventory.repository.inventory.master.SosProductMasterRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.util.ParseUtil;
import com.sospl.inventory.service.SosProductionPlanService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SosProductionPlanServiceImpl
        extends BaseMasterServiceImpl<SosProductionPlan, Long>
        implements SosProductionPlanService {

    private static final Logger log =
            LoggerFactory.getLogger(SosProductionPlanServiceImpl.class);

    private final SosProductionPlanRepository planRepository;
    private final SosProductionPlanMapper planMapper;
    
    private final SosWorkOrderRepository workOrderRepository;
    private final SosProductMasterRepository productMasterRepository;

    public SosProductionPlanServiceImpl(
            SosProductionPlanRepository repository,
            SosProductionPlanMapper planMapper ,SosWorkOrderRepository _workOrderRepository,SosProductMasterRepository _productMasterRepository) {
        super(repository);
        this.planRepository = repository;
        this.planMapper     = planMapper;
        this.workOrderRepository = _workOrderRepository;
        this.productMasterRepository  = _productMasterRepository;
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
	
	
	@Override
	public PagedResponse<SosProductionPlanSummaryResponse> findAllProductionPlanSummary(
	        int page, int size) {

	    Pageable pageable = PageRequest.of(page, size);
	    Page<Object[]> pageData = planRepository
	            .findAllProductionPlanSummary(pageable);

	    List<SosProductionPlanSummaryResponse> content = pageData
	            .getContent()
	            .stream()
	            .filter(row -> row != null && row[0] != null)
	            .map(row -> {
	                SosProductionPlanSummaryResponse res =
	                        new SosProductionPlanSummaryResponse();
	                res.setProductionPlanId(ParseUtil.toLong(row[0]));
	                res.setProductionFromDate(ParseUtil.toLocalDateTime(row[1]));
	                res.setProductionToDate(ParseUtil.toLocalDateTime(row[2]));
	                res.setWoCode(ParseUtil.toString(row[3]));
	                res.setVesselName(ParseUtil.toString(row[4]));
	                res.setQty(ParseUtil.toBigDecimal(row[5]));
	                res.setWoId(ParseUtil.toLong(row[6]));
	                res.setPoId(ParseUtil.toLong(row[7]));
	                res.setPlant(ParseUtil.toString(row[8]));
	                res.setProductName(ParseUtil.toString(row[9]));
	                res.setWoQty(ParseUtil.toBigDecimal(row[10]));
	                res.setPerUnitRate(ParseUtil.toBigDecimal(row[11]));
	                return res;
	            })
	            .collect(Collectors.toList());

	    return new PagedResponse<>(
	            content,
	            pageData.getNumber(),
	            pageData.getSize(),
	            pageData.getTotalElements(),
	            pageData.getTotalPages(),
	            pageData.isFirst(),
	            pageData.isLast());
	}

	// ── Safe LocalDateTime conversion ─────────────────────────────────────────
	
	@Override
	public SosProductionPlan findByIdWithProductDetails(Long id) {

	    // Step 1 — Fetch production plan
	    SosProductionPlan plan = planRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException(
	                    "Production plan not found: " + id));

	    // Step 2 — Fetch work order by wo_id
	    if (plan.getWoId() != null) {
	        workOrderRepository.findById(plan.getWoId())
	                .ifPresent(wo -> {

	                    // Step 3 — Fetch product by product_id
	                    if (wo.getProductId() != null) {
	                        productMasterRepository
	                                .findById(wo.getProductId())
	                                .ifPresent(product -> {
	                                    plan.setProductName(
	                                            product.getProductName());
	                                    plan.setProductCode(
	                                           product.getProductCode().toString());
	                                });
	                    }
	                });
	    }

	    return plan;
	}
	
}
