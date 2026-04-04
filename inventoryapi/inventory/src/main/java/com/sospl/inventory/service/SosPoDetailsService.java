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
    
    

    public List<SosPoDetailsResponse> findByPoRefNoWithReceipt(Long poRefNo) {
        List<Object[]> results = sosPoDetailsRepository
                .findByPoRefNoWithReceipt(poRefNo);
        return results.stream()
                .map(row -> {
                    SosPoDetailsResponse response = new SosPoDetailsResponse();
                    response.setPoDetId(toLong(row[0]));
                    response.setPoRefNo(toLong(row[1]));
                    response.setPoRmCode(toString(row[2]));
                    response.setPoRmName(toString(row[3]));
                    response.setPoQty(toBigDecimal(row[4]));
                    response.setPoRate(toBigDecimal(row[5]));
                    response.setPoUom(toString(row[6]));
                    response.setSgst(toBigDecimal(row[7]));
                    response.setSgstValue(toBigDecimal(row[8]));
                    response.setCgst(toBigDecimal(row[9]));
                    response.setCgstValue(toBigDecimal(row[10]));
                    response.setIgst(toBigDecimal(row[11]));
                    response.setIgstValue(toBigDecimal(row[12]));
                    response.setPoNoOfPacks(toBigDecimal(row[13]));
                    response.setPoPackSize(toBigDecimal(row[14]));
                    response.setHSnCode(toString(row[15]));
                    response.setIsActive(toBoolean(row[16]));  // ← safe
                    response.setRmReceivedQty(toBigDecimal(row[17]));
                    response.setInspectedBy(toString(row[18]));
                    response.setApprovedBy(toString(row[19]));
                    response.setLotNumber(toString(row[20]));
                    response.setExpDateDel(toString(row[21]));
                    response.setActDateDel(toString(row[22]));
                    response.setPoReceiptNo(toLong(row[23]));
                    response.setFreight(toString(row[24]));
                    response.setRmRcvdQty(toBigDecimal(row[25]));
                    
                    return response;
                })
                .collect(Collectors.toList());
    }

    // ── Safe conversion helpers ───────────────────────────────────────────────

    private Long toLong(Object val) {
        if (val == null) return null;
        if (val instanceof Long) return (Long) val;
        if (val instanceof Number) return ((Number) val).longValue();
        try { return Long.parseLong(String.valueOf(val)); }
        catch (Exception e) { return null; }
    }

    private BigDecimal toBigDecimal(Object val) {
        if (val == null) return null;
        if (val instanceof BigDecimal) return (BigDecimal) val;
        try { return new BigDecimal(String.valueOf(val)); }
        catch (Exception e) { return null; }
    }

    private String toString(Object val) {
        if (val == null) return null;
        return String.valueOf(val);
    }

    private Boolean toBoolean(Object val) {
        if (val == null) return null;
        if (val instanceof Boolean) return (Boolean) val;
        if (val instanceof Number) return ((Number) val).intValue() == 1;
        return Boolean.parseBoolean(String.valueOf(val));
    }

}