package com.sospl.inventory.service.inventory.master.view.impl;

import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosSupplierMasterVResponse;
import com.sospl.inventory.model.inventory.master.view.SosSupplierMasterView;
import com.sospl.inventory.repository.inventory.master.view.SosSupplierMasterViewRepository;
import com.sospl.inventory.service.inventory.master.view.SosSupplierViewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SosSupplierViewServiceImpl implements SosSupplierViewService {

    private final SosSupplierMasterViewRepository repository;

    public SosSupplierViewServiceImpl(
            SosSupplierMasterViewRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<SosSupplierMasterVResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SosSupplierMasterVResponse> findAllActive() {
        return repository.findAllByIsActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SosSupplierMasterVResponse findById(Long supplierId) {
        return repository.findBySupplierId(supplierId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
    }

    @Override
    public PagedResponse<SosSupplierMasterVResponse> findAllPaginated(
            int page, int size, String sortBy, String sortDir) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDir);
        return buildPagedResponse(repository.findAll(pageable));
    }

    @Override
    public PagedResponse<SosSupplierMasterVResponse> findAllActivePaginated(
            int page, int size, String sortBy, String sortDir) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDir);
        return buildPagedResponse(repository.findAllByIsActiveTrue(pageable));
    }

    @Override
    public PagedResponse<SosSupplierMasterVResponse> search(
            String keyword, int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDir);
        return buildPagedResponse(repository.searchPaginated(keyword, pageable));
    }

    private Pageable buildPageable(int page, int size,
                                    String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return PageRequest.of(page, size, sort);
    }

    private PagedResponse<SosSupplierMasterVResponse> buildPagedResponse(
            Page<SosSupplierMasterView> pageData) {
        List<SosSupplierMasterVResponse> content = pageData.getContent()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return new PagedResponse<>(
                content,
                pageData.getNumber(),
                pageData.getSize(),
                pageData.getTotalElements(),
                pageData.getTotalPages(),
                pageData.isFirst(),
                pageData.isLast()
        );
    }

    private SosSupplierMasterVResponse mapToResponse(
            SosSupplierMasterView entity) {
        SosSupplierMasterVResponse response = new SosSupplierMasterVResponse();
        response.setSupplierId(entity.getSupplierId());
        response.setSupplierName(entity.getSupplierName());
        response.setSupplierCode(entity.getSupplierCode());
        response.setAddress(entity.getAddress());
        response.setCountryName(entity.getCountryName());
        response.setCreatedBy(entity.getCreatedBy());
        response.setCreatedOn(entity.getCreatedOn());
        response.setLastUpdatedBy(entity.getLastUpdatedBy());
        response.setLastUpdatedOn(entity.getLastUpdatedOn());
        response.setIsActive(entity.getIsActive());
        response.setType(entity.getType());
        response.setSupplierTypeName(entity.getSupplierTypeName());
        response.seteCCNo(entity.geteCCNo());
        response.setiTNo(entity.getiTNo());
        response.setrCNo(entity.getrCNo());
        response.setcSTNo(entity.getcSTNo());
        response.setlSTNo(entity.getlSTNo());
        response.setSerTaxRegNo(entity.getSerTaxRegNo());
        response.setSerTaxCertificateNo(entity.getSerTaxCertificateNo());
        response.setSerTaxClassificationNo(entity.getSerTaxClassificationNo());
        response.setRangeNo(entity.getRangeNo());
        response.setRangeAddress(entity.getRangeAddress());
        response.setDivisionNo(entity.getDivisionNo());
        response.setDivisionAddress(entity.getDivisionAddress());
        response.setCommissionerate(entity.getCommissionerate());
        response.setCheqFavr(entity.getCheqFavr());
        response.setPhoneNo(entity.getPhoneNo());
        response.seteMailId(entity.geteMailId());
        response.setContactPerson(entity.getContactPerson());
        response.setContactMobile(entity.getContactMobile());
        return response;
    }
    
    @Override
    public List<DropDownResponse> findAllForDropDown() {
        return repository.findAllForDropDown()
                .stream()
                .map(s -> new DropDownResponse(
                        s.getSupplierId(),
                        s.getSupplierName()))
                .collect(Collectors.toList());
    }
    
    
}