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
    public List<Map<String, Object>> getWoDetails(Long woId) {

        List<Map<String, Object>> result =
                repository.findWoDetailsByWoId(woId);

        if (result == null || result.isEmpty()) {
            return result;
        }

        String lotNumber = repository.findLotNumberByWoId(woId);
        System.out.println("lot number"+lotNumber);

        List<Map<String, Object>> response = new ArrayList<>();

        for (Map<String, Object> item : result) {
            Map<String, Object> mutableItem = new HashMap<>(item);

            mutableItem.put("productionLotNumber", lotNumber);

            response.add(mutableItem);
        }

        return response;
    }
    
    
}