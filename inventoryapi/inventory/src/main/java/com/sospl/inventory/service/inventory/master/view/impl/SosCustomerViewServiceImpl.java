package com.sospl.inventory.service.inventory.master.view.impl;

import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosCustomerMasterVResponse;
import com.sospl.inventory.model.inventory.master.view.SosCustomerMasterView;
import com.sospl.inventory.repository.inventory.master.view.SosCustomerMasterViewRepository;
import com.sospl.inventory.service.inventory.master.view.SosCustomerViewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SosCustomerViewServiceImpl implements SosCustomerViewService {

    private final SosCustomerMasterViewRepository repository;

    public SosCustomerViewServiceImpl(
            SosCustomerMasterViewRepository repository) {
        this.repository = repository;
    }

    @Override
    public SosCustomerMasterVResponse findById(Long customerId) {
        return repository.findByCustomerId(customerId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException(
                        "Customer not found with id: " + customerId));
    }

    @Override
    public PagedResponse<SosCustomerMasterVResponse> findAllPaginated(
            int page, int size, String sortBy, String sortDir) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDir);
        return buildPagedResponse(repository.findAll(pageable));
    }

    @Override
    public PagedResponse<SosCustomerMasterVResponse> findAllActivePaginated(
            int page, int size, String sortBy, String sortDir) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDir);
        return buildPagedResponse(repository.findAllByIsActiveTrue(pageable));
    }

    @Override
    public PagedResponse<SosCustomerMasterVResponse> search(
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

    private PagedResponse<SosCustomerMasterVResponse> buildPagedResponse(
            Page<SosCustomerMasterView> pageData) {
        List<SosCustomerMasterVResponse> content = pageData.getContent()
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

    private SosCustomerMasterVResponse mapToResponse(
            SosCustomerMasterView entity) {
        SosCustomerMasterVResponse response = new SosCustomerMasterVResponse();
        response.setCustomerId(entity.getCustomerId());
        response.setCustomerName(entity.getCustomerName());
        response.setCustomerCode(entity.getCustomerCode());
        response.setAddress(entity.getAddress());
        response.setCountryId(entity.getCountryId());
        response.setCountryName(entity.getCountryName());
        response.setCreatedBy(entity.getCreatedBy());
        response.setCreatedOn(entity.getCreatedOn());
        response.setLastUpdatedBy(entity.getLastUpdatedBy());
        response.setLastUpdatedOn(entity.getLastUpdatedOn());
        response.setIsActive(entity.getIsActive());
        response.setLocation(entity.getLocation());
        response.setType(entity.getType());
        response.setDeliveryAddress(entity.getDeliveryAddress());
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
        response.setBondVale(entity.getBondVale());
        response.setPhoneNo(entity.getPhoneNo());
        response.seteMailId(entity.geteMailId());
        response.setContactPerson(entity.getContactPerson());
        response.setContactMobile(entity.getContactMobile());
        return response;
    }
}