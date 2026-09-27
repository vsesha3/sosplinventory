package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosProductMasterResponse;
import com.sospl.inventory.dto.master.SosProductMasterRequest;
import com.sospl.inventory.model.inventory.master.SosProductMaster;
import com.sospl.inventory.model.master.SosProdMasterRmDetls;
import com.sospl.inventory.repository.inventory.master.SosProductMasterRepository;
import com.sospl.inventory.service.inventory.master.SosProductMasterService;
import com.sospl.inventory.service.master.SosProdMasterRmDetlsService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SosProductMasterServiceImpl implements SosProductMasterService {

    private final SosProductMasterRepository repository;
    private final SosProdMasterRmDetlsService rmDetlsService;


    public SosProductMasterServiceImpl(SosProductMasterRepository repository,SosProdMasterRmDetlsService rmDetlsService) {
        this.repository = repository;
        this.rmDetlsService = rmDetlsService;
    }

    @Override
    @Transactional
    public SosProductMaster save(SosProductMasterRequest request) {

        // 1. Convert request DTO to Product entity
        SosProductMaster entity = new SosProductMaster();

        entity.setProductCode(request.getProductCode());
        entity.setProductName(request.getProductName());
        entity.setUomId(request.getUomId());
        entity.setProductGroupId(request.getProductGroupId());
        entity.setTestId(request.getTestId());
        entity.setRate(request.getRate());

        // Add other fields if required
       
       
        entity.setBrandName(request.getBrandName());
        entity.setFgLotCode(request.getFgLotCode());
        entity.setCapacity(request.getCapacity());
        entity.setPackingType(request.getPackingType());
       
        entity.setConversionCost(request.getConversionCost());

        // 2. Save product first
        SosProductMaster saved = repository.save(entity);

        // 3. Get generated Product ID
        Long productId = saved.getProductId().longValue();

        // 4. Save RM mappings
        rmDetlsService.saveOrUpdateRMDetails(
                productId,
                request.getRmDetails()
        );

        return saved;
    }

    @Override
    @Transactional
    public SosProductMaster update(Long id, SosProductMasterRequest entity) {

        SosProductMaster existing = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found: " + id));

        existing.setProductCode(entity.getProductCode());
        existing.setProductName(entity.getProductName());
        existing.setUomId(entity.getUomId());
        existing.setProductGroupId(entity.getProductGroupId());
        existing.setTestId(entity.getTestId());
        existing.setRate(entity.getRate());

        // RM details
        List<SosProdMasterRmDetls> rmDetails =
                entity.getRmDetails();

        rmDetlsService.saveOrUpdateRMDetails(
                id,
                rmDetails
        );

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