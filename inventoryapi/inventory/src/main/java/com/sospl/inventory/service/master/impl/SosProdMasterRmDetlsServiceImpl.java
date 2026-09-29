package com.sospl.inventory.service.master.impl;

import com.sospl.inventory.dto.master.SosProdMasterRmDetlsResponse;
import com.sospl.inventory.model.master.SosProdMasterRmDetls;
import com.sospl.inventory.repository.master.SosProdMasterRmDetlsRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.master.SosProdMasterRmDetlsService;
import com.sospl.inventory.util.ParseUtil;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SosProdMasterRmDetlsServiceImpl
        extends BaseMasterServiceImpl<SosProdMasterRmDetls, Long>
        implements SosProdMasterRmDetlsService {

    private final SosProdMasterRmDetlsRepository rmDetlsRepository;

    public SosProdMasterRmDetlsServiceImpl(
            SosProdMasterRmDetlsRepository repository) {
        super(repository);
        this.rmDetlsRepository = repository;
    }

    @Override
    public List<SosProdMasterRmDetls> findByProductId(Long productId) {
        return rmDetlsRepository
                .findAllByProductIdAndIsDeletedFalse(productId);
    }

    @Override
    public List<SosProdMasterRmDetls> findByRmId(Long rmId) {
        return rmDetlsRepository
                .findAllByRmIdAndIsDeletedFalse(rmId);
    }

    @Override
    public List<SosProdMasterRmDetls> findAllActive() {
        return rmDetlsRepository
                .findAllByIsActiveTrueAndIsDeletedFalse();
    }

    @Override
    public List<SosProdMasterRmDetlsResponse> fetchRMdetailsForWOID(
            Long woId, BigDecimal qty) {
        return rmDetlsRepository
                .fetchRMdetailsForWOID(woId, qty)
                .stream()
                .filter(row -> row != null && row[0] != null)
                .map(row -> {
                    SosProdMasterRmDetlsResponse res =
                            new SosProdMasterRmDetlsResponse();
                    res.setWoId(ParseUtil.toLong(row[0]));
                    res.setWoCode(ParseUtil.toString(row[1]));
                    res.setProductId(ParseUtil.toLong(row[2]));
                    res.setRmId(ParseUtil.toLong(row[3]));
                    res.setRmCode(ParseUtil.toString(row[4]));
                    res.setRmName(ParseUtil.toString(row[5]));
                    res.setMixPercentage(ParseUtil.toBigDecimal(row[6]));
                    res.setPlanQty(ParseUtil.toBigDecimal(row[7]));
                    res.setRequiredQty(ParseUtil.toBigDecimal(row[8]));
                    return res;
                })
                .collect(Collectors.toList());
    }

    @Override
    public void softDelete(Long id, String deletedBy) {
        SosProdMasterRmDetls existing = rmDetlsRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "RM details not found: " + id));
        existing.setIsDeleted(true);
        existing.setIsActive(false);
        existing.setDeletedBy(deletedBy);
        existing.setDeletedAt(LocalDateTime.now());
        rmDetlsRepository.save(existing);
    }
    
    @Override
    public void saveOrUpdateRMDetails(
            Long productId,
            List<SosProdMasterRmDetls> rmDetails) {

        if (rmDetails == null || rmDetails.isEmpty()) {
            System.out.println("rm details are empty");
            return;
        }
        
     // ── Soft delete rows removed in the UI ────────────────────────────
        Set<Long> incomingIds = rmDetails.stream()
                .map(SosProdMasterRmDetls::getPmRmDetslId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        for (SosProdMasterRmDetls existing :
                rmDetlsRepository.findAllByProductIdAndIsDeletedFalse(productId)) {
            if (!incomingIds.contains(existing.getPmRmDetslId())) {
                softDelete(existing.getPmRmDetslId(), "system");
            }
        }

        for (SosProdMasterRmDetls rmDetail : rmDetails) {

            if (rmDetail.getPmRmDetslId() != null) {

                // Existing record - UPDATE
                SosProdMasterRmDetls existing =
                        rmDetlsRepository
                                .findById(rmDetail.getPmRmDetslId())
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "RM Detail not found: "
                                                        + rmDetail.getPmRmDetslId()));

                existing.setProductId(productId);
                existing.setRmId(rmDetail.getRmId());
                existing.setMixPercentage(rmDetail.getMixPercentage());

                rmDetlsRepository.save(existing);

            } else {

                // New record - INSERT
                rmDetail.setProductId(productId);

                rmDetlsRepository.save(rmDetail);
            }
        }
    }
}