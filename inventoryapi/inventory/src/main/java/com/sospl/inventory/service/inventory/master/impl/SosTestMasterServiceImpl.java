package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.model.inventory.master.SosTestMaster;
import com.sospl.inventory.repository.inventory.master.SosTestMasterRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.inventory.master.SosTestMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SosTestMasterServiceImpl
        extends BaseMasterServiceImpl<SosTestMaster, Long>
        implements SosTestMasterService {

    private final SosTestMasterRepository testRepository;

    public SosTestMasterServiceImpl(SosTestMasterRepository repository) {
        super(repository);
        this.testRepository = repository;
    }

    @Override
    public List<SosTestMaster> findAllActive() {
        return testRepository.findAllByIsActiveTrueAndIsDeletedFalse();
    }

    @Override
    public PagedResponse<SosTestMaster> findAllActivePaginated(
            int page, int size, String sortBy, String sortDir) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDir);
        return buildPagedResponse(
                testRepository.findAllActivePaginated(pageable));
    }

    @Override
    public PagedResponse<SosTestMaster> search(
            String keyword, int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDir);
        return buildPagedResponse(
                testRepository.searchPaginated(keyword, pageable));
    }

    private Pageable buildPageable(int page, int size,
                                    String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return PageRequest.of(page, size, sort);
    }

    private PagedResponse<SosTestMaster> buildPagedResponse(
            Page<SosTestMaster> pageData) {
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