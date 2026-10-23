package com.sospl.inventory.service.impl;


import com.sospl.inventory.repository.SosVesselMasterRepository;

import com.sospl.inventory.service.SosMiscService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SosMiscServiceImpl implements SosMiscService {

    private final SosVesselMasterRepository  repository;

    public SosMiscServiceImpl(SosVesselMasterRepository repository) {
        this.repository = repository;
    }

    
    
    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getWoDetails(
            Long woId, Long rmReqId) {

        List<Map<String, Object>> result =
                repository.findWoDetailsByWoId(woId);

        if (result == null || result.isEmpty()) {
            return result;
        }

        // ── If rmReqId is provided — fetch existing lot number ────────────
        // ── If rmReqId is null — generate new lot number ──────────────────
        String lotNumber = repository.findLotNumberByWoId(
                woId,
                rmReqId != null ? rmReqId : -1L  // ← -1 means no existing req
        );

        

        List<Map<String, Object>> response = new ArrayList<>();

        for (Map<String, Object> item : result) {
            Map<String, Object> mutableItem = new HashMap<>(item);
            mutableItem.put("productionLotNumber", lotNumber);
            mutableItem.put("rmReqId", rmReqId);
            response.add(mutableItem);
        }

        return response;
    }
    
    
}