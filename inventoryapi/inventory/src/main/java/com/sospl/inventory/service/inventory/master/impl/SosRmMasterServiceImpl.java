package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.dto.inventory.master.SosRmMasterRequest;
import com.sospl.inventory.dto.inventory.master.SosRmMasterResponse;
import com.sospl.inventory.mapper.inventory.master.SosRmMasterMapper;
import com.sospl.inventory.model.inventory.master.SosRmMaster;
import com.sospl.inventory.repository.inventory.master.SosRmMasterRepository;
import com.sospl.inventory.service.inventory.master.SosRmMasterService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SosRmMasterServiceImpl implements SosRmMasterService {

    private final SosRmMasterRepository repository;

    public SosRmMasterServiceImpl(SosRmMasterRepository repository) {
        this.repository = repository;
    }

    @Override
    public SosRmMasterResponse create(SosRmMasterRequest request) {

        SosRmMaster entity = SosRmMasterMapper.toEntity(request);
        repository.save(entity);

        return findById(entity.getRmId());
    }

    @Override
    public SosRmMasterResponse update(Integer id, SosRmMasterRequest request) {

        SosRmMaster existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("RM not found"));

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

    @Override
    public List<SosRmMasterResponse> findAll() {
        return repository.findAllWithDetails();
    }

    @Override
    public SosRmMasterResponse findById(Integer id) {
        return repository.findAllWithDetails()
                .stream()
                .filter(r -> r.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("RM not found"));
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }
}