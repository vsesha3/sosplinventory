package com.sospl.inventory.service;

import com.sospl.inventory.dto.inventory.SosPoDetailsRequestDto;
import com.sospl.inventory.dto.inventory.view.SosPoDetailsResponse;
import com.sospl.inventory.model.SosPoDetails;
import com.sospl.inventory.repository.SosPoDetailsRepository;
import com.sospl.inventory.repository.inventory.master.SosUomMasterRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SosPoDetailsService {

    private final SosPoDetailsRepository sosPoDetailsRepository;
    
    private final SosUomMasterRepository sosUomMasterRepository;

    public SosPoDetailsService(SosPoDetailsRepository sosPoDetailsRepository,SosUomMasterRepository _sosUomMasterRepository) {
        this.sosPoDetailsRepository = sosPoDetailsRepository;
        this.sosUomMasterRepository = _sosUomMasterRepository;
    }

    // ── READ ──────────────────────────────────────────────────────────────────

    public List<SosPoDetailsResponse> findByPoRefNo(Long poRefNo) {
        return sosPoDetailsRepository.findByPoRefNoAndIsActiveTrue(poRefNo)
                .stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    // ── WRITE ─────────────────────────────────────────────────────────────────

    @Transactional
    public void saveOrUpdateLineItems(Long poRefNo, List<SosPoDetailsRequestDto> lineItems) {
        sosPoDetailsRepository.deactivateByPoRefNo(poRefNo);

        for (SosPoDetailsRequestDto dto : lineItems) {
            SosPoDetails entity;

            if (dto.getPoDetId() != null) {
                entity = sosPoDetailsRepository.findById(dto.getPoDetId())
                        .orElse(new SosPoDetails());
            } else {
                entity = new SosPoDetails();
            }

            mapDtoToEntity(dto, entity, poRefNo);
            sosPoDetailsRepository.save(entity);
        }
    }

    // ── MAPPERS ───────────────────────────────────────────────────────────────

    private SosPoDetailsResponse mapEntityToResponse(SosPoDetails entity) {
        SosPoDetailsResponse response = new SosPoDetailsResponse();
       
        String uomName = null;
        if (entity.getPoUom() != null && !entity.getPoUom().isBlank()) {
            try {
                Long uomId = Long.parseLong(entity.getPoUom());
                uomName = sosUomMasterRepository.findById(uomId)
                        .map(uom -> uom.getUomName())
                        .orElse(entity.getPoUom()); // fallback to raw value if not found
            } catch (NumberFormatException e) {
                uomName = entity.getPoUom(); // fallback if not numeric
            }
        }
        
        response.setPoDetId(entity.getPoDetId());
        response.setPoRefNo(entity.getPoRefNo());
        response.setPoRmCode(entity.getPoRmCode());
        response.setPoRmName(entity.getPoRmName());
        response.setPoQty(entity.getPoQty());
        response.setPoRate(entity.getPoRate());
        response.setPoUom(uomName);
        response.setSgst(entity.getSgst());
        response.setSgstValue(entity.getSgstValue());
        response.setCgst(entity.getCgst());
        response.setCgstValue(entity.getCgstValue());
        response.setIgst(entity.getIgst());
        response.setIgstValue(entity.getIgstValue());
        response.setPoNoOfPacks(entity.getPoNoOfPacks());
        response.setPoPackSize(entity.getPoPackSize());
        response.setHSnCode(entity.getHSnCode());
        response.setIsActive(entity.getIsActive());
        return response;
    }

    private void mapDtoToEntity(SosPoDetailsRequestDto dto, SosPoDetails entity, Long poRefNo) {
        entity.setPoRefNo(poRefNo);
        entity.setPoRmCode(dto.getPoRmCode());
        entity.setPoRmName(dto.getPoRmName());
        entity.setPoQty(dto.getPoQty());
        entity.setPoRate(dto.getPoRate());
        entity.setPoUom(dto.getPoUom());
        entity.setSgst(dto.getSgst());
        entity.setCgst(dto.getCgst());
        entity.setIgst(dto.getIgst());
        entity.setPoNoOfPacks(dto.getPoNoOfPacks());
        entity.setPoPackSize(dto.getPoPackSize());
        entity.setHSnCode(dto.getHsnCode());
        entity.setIsActive(true);

        if (dto.getPoQty() != null && dto.getPoRate() != null) {
            BigDecimal baseAmount = dto.getPoQty().multiply(dto.getPoRate());

            if (dto.getSgst() != null) {
                entity.setSgstValue(baseAmount.multiply(dto.getSgst())
                        .divide(BigDecimal.valueOf(100)));
            }
            if (dto.getCgst() != null) {
                entity.setCgstValue(baseAmount.multiply(dto.getCgst())
                        .divide(BigDecimal.valueOf(100)));
            }
            if (dto.getIgst() != null) {
                entity.setIgstValue(baseAmount.multiply(dto.getIgst())
                        .divide(BigDecimal.valueOf(100)));
            }
        }
    }
}