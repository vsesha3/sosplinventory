package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosCapitalGoodsMasterResponse;
import com.sospl.inventory.model.inventory.master.SosCapitalGoodsMaster;
import com.sospl.inventory.repository.inventory.master.SosCapitalGoodsMasterRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.inventory.master.SosCapitalGoodsMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SosCapitalGoodsMasterServiceImpl
        extends BaseMasterServiceImpl<SosCapitalGoodsMaster, Long>
        implements SosCapitalGoodsMasterService {

    private final SosCapitalGoodsMasterRepository cgRepository;

    public SosCapitalGoodsMasterServiceImpl(
            SosCapitalGoodsMasterRepository repository) {
        super(repository);
        this.cgRepository = repository;
    }

    @Override
    public List<SosCapitalGoodsMasterResponse> findAllWithDetails() {
        return cgRepository.findAllWithDetails();
    }

    @Override
    public PagedResponse<SosCapitalGoodsMasterResponse> findAllWithDetailsPaginated(
            int page, int size, String sortBy, String sortDir) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDir);
        Page<SosCapitalGoodsMasterResponse> result =
                cgRepository.findAllWithDetailsPaginated(pageable);
        return buildPagedResponse(result);
    }

    @Override
    public PagedResponse<SosCapitalGoodsMasterResponse> search(
            String keyword, int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDir);
        Page<SosCapitalGoodsMasterResponse> result =
                cgRepository.searchWithDetailsPaginated(keyword, pageable);
        return buildPagedResponse(result);
    }

    private Pageable buildPageable(int page, int size,
                                    String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return PageRequest.of(page, size, sort);
    }

    private PagedResponse<SosCapitalGoodsMasterResponse> buildPagedResponse(
            Page<SosCapitalGoodsMasterResponse> pageData) {
        return new PagedResponse<>(
                pageData.getContent(),
                pageData.getNumber(),
                pageData.getSize(),
                pageData.getTotalElements(),
                pageData.getTotalPages(),
                pageData.isFirst(),
                pageData.isLast()
        );
    }
}