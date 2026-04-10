package com.sospl.inventory.service.master.impl;

import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.model.master.SosProdMasterPmDetls;
import com.sospl.inventory.repository.master.SosProdMasterPmDetlsRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.master.SosProdMasterPmDetlsService;
import com.sospl.inventory.util.ParseUtil;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SosProdMasterPmDetlsServiceImpl
        extends BaseMasterServiceImpl<SosProdMasterPmDetls, Long>
        implements SosProdMasterPmDetlsService {

    private final SosProdMasterPmDetlsRepository detlsRepository;

    public SosProdMasterPmDetlsServiceImpl(
            SosProdMasterPmDetlsRepository repository) {
        super(repository);
        this.detlsRepository = repository;
    }

    @Override
    public List<SosProdMasterPmDetls> findByProductId(Long productId) {
        return detlsRepository
                .findAllByProductIdAndIsDeletedFalse(productId);
    }

    @Override
    public List<SosProdMasterPmDetls> findByPmId(Long pmId) {
        return detlsRepository
                .findAllByPmIdAndIsDeletedFalse(pmId);
    }

    @Override
    public List<SosProdMasterPmDetls> findByProductIdAndPmId(
            Long productId, Long pmId) {
        return detlsRepository
                .findAllByProductIdAndPmIdAndIsDeletedFalse(
                        productId, pmId);
    }

    @Override
    public List<SosProdMasterPmDetls> findAllActive() {
        return detlsRepository
                .findAllByIsActiveTrueAndIsDeletedFalse();
    }

    @Override
    public void softDelete(Long id, String deletedBy) {
        SosProdMasterPmDetls existing = detlsRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Record not found: " + id));
        existing.setIsDeleted(true);
        existing.setIsActive(false);
        existing.setDeletedBy(deletedBy);
        existing.setDeletedAt(LocalDateTime.now());
        detlsRepository.save(existing);
    }
    
    @Override
    public List<DropDownResponse> findAllForDropDown() {
        return detlsRepository.findAllWithPmDetails()
                .stream()
                .filter(row -> row != null && row[1] != null)
                .map(row -> new DropDownResponse(
                        ParseUtil.toString(row[0]),   // pmProductKey → "3_101"  (value)
                        ParseUtil.toString(row[1]) != null
                                ? ParseUtil.toString(row[1])
                                : "-"))                                                 // pmName
                .collect(Collectors.toList());
    }
}