package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosRmMasterNativeResponse;
import com.sospl.inventory.dto.inventory.master.SosRmMasterRequest;
import com.sospl.inventory.dto.inventory.master.SosRmMasterResponse;
import com.sospl.inventory.mapper.inventory.master.SosRmMasterMapper;
import com.sospl.inventory.model.inventory.master.SosRmMaster;
import com.sospl.inventory.repository.inventory.master.SosRmGroupMasterRepository;
import com.sospl.inventory.repository.inventory.master.SosRmMasterRepository;
import com.sospl.inventory.service.inventory.master.SosRmMasterService;
import com.sospl.inventory.util.ParseUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SosRmMasterServiceImpl implements SosRmMasterService {

    private final SosRmMasterRepository repository;
    private final SosRmGroupMasterRepository rmGroupRepository;

    public SosRmMasterServiceImpl(
            SosRmMasterRepository repository,
            SosRmGroupMasterRepository rmGroupRepository) {
        this.repository       = repository;
        this.rmGroupRepository = rmGroupRepository;
    }

    @Override
    public SosRmMaster create(SosRmMasterRequest request) {
        SosRmMaster entity = SosRmMasterMapper.toEntity(request);
        repository.save(entity);
        return findById(entity.getRmId());
    }

    @Override
    public SosRmMaster update(Integer id,
            SosRmMasterRequest request) {
        SosRmMaster existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "RM not found"));
        existing.setRmCode(request.getRmCode());
        existing.setRmName(request.getRmName());
        existing.setUomId(request.getUomId());
        existing.setRmGroupId(request.getRmGroupId());
        existing.setTestId(request.getTestId());
        existing.setAvgRate(request.getAvgRate());
        existing.setPackSize(request.getPackSize());
        existing.setCapacity(request.getCapacity());
        existing.setPackUom(request.getPackUom());
        repository.save(existing);
        return findById(id);
    }

    // ── Fix 1 — findAll returns List<SosRmMasterResponse> ────────────────
    @Override
    public List<SosRmMasterResponse> findAll() {
        return findAllWithDetails();
    }

    // ── Fix 2 — findById returns SosRmMasterResponse ─────────────────────
    @Override
    public SosRmMaster findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "RM not found: " + id));
    }

    // ── Fix 3 — findAllWithDetails uses Object[] mapping ─────────────────
    @Override
    public List<SosRmMasterResponse> findAllWithDetails() {
        return repository.findAllWithDetails()
                .stream()
                .filter(row -> row != null && row[0] != null)
                .map(row -> new SosRmMasterResponse(
                        ParseUtil.toInteger(row[0]),
                        ParseUtil.toInteger(row[1]) != null
                                ? ParseUtil.toInteger(row[1])
                                        .longValue()
                                : null,
                        ParseUtil.toString(row[2]),
                        ParseUtil.toString(row[3]),
                        ParseUtil.toString(row[4]),
                        ParseUtil.toString(row[5]),
                        ParseUtil.toBigDecimal(row[6]),
                        ParseUtil.toInteger(row[7]) != null
                                ? ParseUtil.toInteger(row[7])
                                : 0
                ))
                .collect(Collectors.toList());
    }

    @Override
    public SosRmMaster findByRmCode(Integer code) {
        return repository
                .findByRmCodeAndIsDeletedFalse(code)
                .orElseThrow(() -> new RuntimeException(
                        "RM not found for code: " + code));
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public PagedResponse<SosRmMasterResponse> findAllPaginated(
            int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDir);
        Page<SosRmMasterResponse> result =
                repository.findAllWithDetailsPaginated(pageable);
        return buildPagedResponse(result);
    }

    @Override
    public PagedResponse<SosRmMasterResponse> search(
            String keyword, int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDir);
        Page<SosRmMasterResponse> result =
                repository.searchWithDetailsPaginated(keyword, pageable);
        return buildPagedResponse(result);
    }

    // ── Native response methods ───────────────────────────────────────────

    @Override
    public List<SosRmMasterNativeResponse> findAllActiveWithDetails() {
        return repository.findAllActiveWithDetails();
    }

    @Override
    public PagedResponse<SosRmMasterNativeResponse>
            findAllActiveWithDetailsPaginated(
                    int page, int size,
                    String sortBy, String sortDir) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDir);
        Page<SosRmMasterNativeResponse> result =
                repository.findAllActiveWithDetailsPaginated(pageable);
        return buildNativePagedResponse(result);
    }

    @Override
    public PagedResponse<SosRmMasterNativeResponse>
            searchActiveWithDetails(
                    String keyword, int page, int size,
                    String sortBy, String sortDir) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDir);
        Page<SosRmMasterNativeResponse> result =
                repository.searchActiveWithDetailsPaginated(
                        keyword, pageable);
        return buildNativePagedResponse(result);
    }

    // ── Dropdown methods ──────────────────────────────────────────────────

    @Override
    public List<DropDownResponse> findAllForDropDown() {
        return repository
                .findAllByIsActiveTrueAndIsDeletedFalse()
                .stream()
                .filter(r -> r.getRmId() != null)
                .map(r -> new DropDownResponse(
                        r.getRmId(),
                        r.getRmName() != null
                                ? r.getRmName() : "-"))
                .collect(Collectors.toList());
    }

    @Override
    public List<DropDownResponse> findAllForDropDownRmGroup() {
        return rmGroupRepository.findAll()
                .stream()
                .filter(r -> r.getRmGroupId() != null)
                .map(r -> new DropDownResponse(
                        r.getRmGroupId(),
                        r.getRmGroupName() != null
                                ? r.getRmGroupName() : "-"))
                .collect(Collectors.toList());
    }

    @Override
    public List<SosRmMasterResponse> findAllActiveWithDetailsLong() {
        return repository.findAllActiveWithDetails()
                .stream()
                .filter(r -> r.getRmId() != null)
                .map(r -> new SosRmMasterResponse(
                        r.getRmId() != null
                                ? r.getRmId().longValue() : null,
                        r.getRmCode(),
                        r.getRmName() != null ? r.getRmName() : "-",
                        r.getUomId(),
                        r.getUomName() != null ? r.getUomName() : "-",
                        r.getPackUom(),
                        r.getPackUomName() != null
                                ? r.getPackUomName() : "-",
                        r.getAvgRate(),
                        r.getPackSize()
                ))
                .collect(Collectors.toList());
    }

    // ── Private helpers ───────────────────────────────────────────────────

    private Pageable buildPageable(int page, int size,
            String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return PageRequest.of(page, size, sort);
    }

    private PagedResponse<SosRmMasterResponse> buildPagedResponse(
            Page<SosRmMasterResponse> page) {
        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast());
    }

    private PagedResponse<SosRmMasterNativeResponse>
            buildNativePagedResponse(
                    Page<SosRmMasterNativeResponse> page) {
        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast());
    }
}