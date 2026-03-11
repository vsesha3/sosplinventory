package com.sospl.inventory.service.inventory.view.impl;

import com.sospl.inventory.dto.inventory.view.SosPoDetailsResponse;
import com.sospl.inventory.model.inventory.SosPoDetails;
import com.sospl.inventory.repository.inventory.view.SosPoDetailsRepository;
import com.sospl.inventory.service.inventory.view.SosPoDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SosPoDetailsServiceImpl implements SosPoDetailsService {

    private final SosPoDetailsRepository repository;

    public SosPoDetailsServiceImpl(SosPoDetailsRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<SosPoDetailsResponse> findByPoRefNo(Long poRefNo) {
        return repository.findByPoRefNo(poRefNo)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private SosPoDetailsResponse mapToResponse(SosPoDetails entity) {
        SosPoDetailsResponse response = new SosPoDetailsResponse();
        response.setPoDetId(entity.getPoDetId());
        response.setPoRefNo(entity.getPoRefNo());
        response.setPoRmCode(entity.getPoRmCode());
        response.setPoRmName(entity.getPoRmName());
        response.setPoQty(entity.getPoQty());
        response.setPoRate(entity.getPoRate());
        response.setPoUom(entity.getPoUom());
        response.setSgst(entity.getSgst());
        response.setSgstValue(entity.getSgstValue());
        response.setPoNoOfPacks(entity.getPoNoOfPacks());
        response.setPoPackSize(entity.getPoPackSize());
        response.setCgst(entity.getCgst());
        response.setCgstValue(entity.getCgstValue());
        response.setIgst(entity.getIgst());
        response.setIgstValue(entity.getIgstValue());
        response.setHSnCode(entity.getHSnCode());
        return response;
    }
}