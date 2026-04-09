package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosPmMasterResponse;
import com.sospl.inventory.model.inventory.master.SosPmMaster;
import com.sospl.inventory.repository.inventory.master.SosPmMasterRepository;
import com.sospl.inventory.service.inventory.master.SosPmMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SosPmMasterServiceImpl implements SosPmMasterService {

    private final SosPmMasterRepository repository;

    public SosPmMasterServiceImpl(SosPmMasterRepository repository) {
        this.repository = repository;
    }

    @Override
    public SosPmMaster save(SosPmMaster entity) {
        return repository.save(entity);
    }

    @Override
    public SosPmMaster update(Integer id, SosPmMaster entity) {
        SosPmMaster existing = repository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("PM not found"));
        existing.setPmCode(entity.getPmCode());
        existing.setPmName(entity.getPmName());
        existing.setPmSize(entity.getPmSize());
        existing.setFgLotCode(entity.getFgLotCode());
        existing.setAvgRate(entity.getAvgRate());
        existing.setPmGroupId(entity.getPmGroupId());
        existing.setTareWgt(entity.getTareWgt());
        existing.setUomId(entity.getUomId());
        existing.sethNhId(entity.gethNhId());
        return repository.save(existing);
    }

    @Override
    public Optional<SosPmMaster> findById(Integer id) {
        return repository.findById(Long.valueOf(id));
    }

    @Override
    public List<SosPmMaster> findAll() {
        return repository.findAllByIsDeletedFalse();
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(Long.valueOf(id));
    }

    @Override
    public List<SosPmMasterResponse> findAllWithDetails() {
        return repository.findAllWithDetails();
    }

    @Override
    public PagedResponse<SosPmMasterResponse> findAllPaginated(
            int page, int size, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<SosPmMasterResponse> result =
                repository.findAllWithDetailsPaginated(pageable);

        return buildPagedResponse(result);
    }

    @Override
    public PagedResponse<SosPmMasterResponse> search(
            String keyword, int page, int size,
            String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<SosPmMasterResponse> result =
                repository.searchWithDetailsPaginated(keyword, pageable);

        return buildPagedResponse(result);
    }

    private PagedResponse<SosPmMasterResponse> buildPagedResponse(
            Page<SosPmMasterResponse> page) {
        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }
    
    @Override
    public List<SosPmMaster> findAllActiveForDropdown() {
        return repository.findAllByIsActiveTrueAndIsDeletedFalse();
    }
    
    @Override
    public List<DropDownResponse> findAllForDropDown() {
        return repository.findAllByIsActiveTrueAndIsDeletedFalse()
                .stream()
                .filter(p -> p.getPmId() != null)
                .map(p -> new DropDownResponse(
                        p.getPmId(),
                        p.getPmName() != null ? p.getPmName() : "-"))
                .collect(Collectors.toList());
    }
    
   
}