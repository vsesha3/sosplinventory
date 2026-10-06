package com.sospl.inventory.service.impl.master;

import com.sospl.inventory.model.master.SosMiscMaster;
import com.sospl.inventory.repository.master.SosMiscMasterRepository;
import com.sospl.inventory.service.master.SosMiscMasterService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SosMiscMasterServiceImpl implements SosMiscMasterService {

    private final SosMiscMasterRepository repository;

    public SosMiscMasterServiceImpl(
            SosMiscMasterRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<SosMiscMaster> getAll() {
        return repository.findAll();
    }

    @Override
    public List<SosMiscMaster> getActive() {
        return repository.findByIsActive(true);
    }

    @Override
    public SosMiscMaster getById(Long miscId) {
        return repository.findById(miscId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Misc Master not found with ID: " + miscId));
    }

    @Override
    public SosMiscMaster getByCode(String miscCode) {

        return repository.findByMiscCode(
                miscCode.toUpperCase()
        ).orElseThrow(() ->
                new RuntimeException(
                        "Misc Master not found with code: " + miscCode));
    }

    @Override
    public SosMiscMaster save(SosMiscMaster miscMaster) {

        if (miscMaster.getMiscCode() != null) {
            miscMaster.setMiscCode(
                    miscMaster.getMiscCode().toUpperCase()
            );
        }

        if (miscMaster.getIsActive() == null) {
            miscMaster.setIsActive(true);
        }

        if (miscMaster.getIsDeleted() == null) {
            miscMaster.setIsDeleted(false);
        }

        return repository.save(miscMaster);
    }

    @Override
    public SosMiscMaster update(
            Long miscId,
            SosMiscMaster miscMaster) {

        SosMiscMaster existing = getById(miscId);

        if (miscMaster.getMiscCode() != null) {
            existing.setMiscCode(
                    miscMaster.getMiscCode().toUpperCase()
            );
        }

        existing.setMiscName(
                miscMaster.getMiscName()
        );

        existing.setAvgRate(
                miscMaster.getAvgRate()
        );

        existing.setUomId(
                miscMaster.getUomId()
        );

        if (miscMaster.getIsActive() != null) {
            existing.setIsActive(
                    miscMaster.getIsActive()
            );
        }

        return repository.save(existing);
    }

    @Override
    public void delete(Long miscId) {

        SosMiscMaster existing = getById(miscId);

        existing.setIsDeleted(true);
        existing.setIsActive(false);

        repository.save(existing);
    }
}