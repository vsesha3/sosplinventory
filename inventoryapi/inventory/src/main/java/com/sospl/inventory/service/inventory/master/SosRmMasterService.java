package com.sospl.inventory.service.inventory.master;

import com.sospl.inventory.dto.inventory.master.SosRmMasterRequest;
import com.sospl.inventory.dto.inventory.master.SosRmMasterResponse;

import java.util.List;

public interface SosRmMasterService {

    SosRmMasterResponse create(SosRmMasterRequest request);

    SosRmMasterResponse update(Long id, SosRmMasterRequest request);

    List<SosRmMasterResponse> findAll();

    SosRmMasterResponse findById(Long id);

    void delete(Long id);
}