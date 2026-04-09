package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosProductMasterResponse;
import com.sospl.inventory.model.inventory.master.SosProductMaster;
import com.sospl.inventory.repository.inventory.master.SosProductMasterRepository;
import com.sospl.inventory.service.inventory.master.SosProductMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SosProductMasterServiceImpl implements SosProductMasterService {

    private final SosProductMasterRepository repository;

    public SosProductMasterServiceImpl(SosProductMasterRepository repository) {
        this.repository = repository;
    }

    @Override
    public SosProductMaster save(SosProductMaster entity) {
        return repository.save(entity);
    }

    @Override
    public SosProductMaster update(Long id, SosProductMaster entity) {
        SosProductMaster existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        existing.setProductCode(entity.getProductCode());
        existing.setProductName(entity.getProductName());
        existing.setUomId(entity.getUomId());
        existing.setProductGroupId(entity.getProductGroupId());
        existing.setTestId(entity.getTestId());
        existing.setRate(entity.getRate());
        return repository.save(existing);
    }

    @Override
    public Optional<SosProductMaster> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<SosProductMaster> findAll() {
        return repository.findAllByIsDeletedFalse();
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<SosProductMasterResponse> findAllWithDetails() {
        return repository.findAllWithDetails();
    }

    @Override
    public PagedResponse<SosProductMasterResponse> findAllPaginated(
            int page, int size, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<SosProductMasterResponse> result =
                repository.findAllWithDetailsPaginated(pageable);

        return buildPagedResponse(result);
    }

    @Override
    public PagedResponse<SosProductMasterResponse> search(
            String keyword, int page, int size,
            String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<SosProductMasterResponse> result =
                repository.searchWithDetailsPaginated(keyword, pageable);

        return buildPagedResponse(result);
    }

    private PagedResponse<SosProductMasterResponse> buildPagedResponse(
            Page<SosProductMasterResponse> page) {
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
    public List<DropDownResponse> findAllForDropDown() {
        return repository.findAllByIsActiveTrueAndIsDeletedFalse()
                .stream()
                .filter(p -> p.getProductId() != null)
                .map(p -> new DropDownResponse(
                        p.getProductId(),
                        p.getProductName() != null ? p.getProductName() : "-"))
                .collect(Collectors.toList());
    }
    
}