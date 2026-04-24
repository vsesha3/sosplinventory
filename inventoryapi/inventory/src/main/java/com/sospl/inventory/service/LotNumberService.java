package com.sospl.inventory.service;

import com.sospl.inventory.model.SosFgLotAutoIncrement;
import com.sospl.inventory.repository.SosFgLotAutoIncrementRepository;
import com.sospl.inventory.repository.SosWorkOrderRepository;
import com.sospl.inventory.repository.inventory.master.SosPmMasterRepository;
import com.sospl.inventory.util.ParseUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class LotNumberService {

    private final SosWorkOrderRepository workOrderRepository;
    private final SosPmMasterRepository pmMasterRepository;
    private final SosFgLotAutoIncrementRepository autoIncrementRepository;

    public LotNumberService(
            SosWorkOrderRepository workOrderRepository,
            SosPmMasterRepository pmMasterRepository,
            SosFgLotAutoIncrementRepository autoIncrementRepository) {
        this.workOrderRepository     = workOrderRepository;
        this.pmMasterRepository      = pmMasterRepository;
        this.autoIncrementRepository = autoIncrementRepository;
    }

    @Transactional
    public String generateLotNumber(Long woId, Long pmId) {

        // ── Step 1 — Get product fg lot code and company code ─────────────
        List<Object[]> woData = workOrderRepository
                .findFgLotCodeByWoId(woId);

        if (woData == null) {
            throw new RuntimeException(
                    "Work order not found: " + woId);
        }
        
        System.out.println("here test"+woData.get(0)[0]);
        String productFgLotCode = (String) woData.get(0)[0];
       
        String companyCode = (String) woData.get(0)[1];        ;
       
     

        // ── Step 2 — Get PM fg lot code ───────────────────────────────────
        String pmFgLotCode = pmMasterRepository
                .findFgLotCodeByPmId(pmId);

        // ── Step 3 — Get current year — YY format ─────────────────────────
        String year = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yy"));

        // ── Step 4 — Get or create auto increment record ──────────────────
        SosFgLotAutoIncrement autoIncrement = autoIncrementRepository
                .findByProductFgLotCodeAndYear(
                        productFgLotCode, year)
                .orElse(null);

        long nextLot;

        if (autoIncrement == null) {
            // First lot for this product in this year
            autoIncrement = new SosFgLotAutoIncrement();
            autoIncrement.setProductFgLotCode(productFgLotCode);
            autoIncrement.setYear(year);
            autoIncrement.setFgAuto(1L);
            autoIncrement.setCreatedAt(LocalDateTime.now());
            nextLot = 1L;
        } else {
            // Increment existing
            nextLot = autoIncrement.getFgAuto() + 1;
            autoIncrement.setFgAuto(nextLot);
            autoIncrement.setUpdatedAt(LocalDateTime.now());
        }

        autoIncrementRepository.save(autoIncrement);

        // ── Step 5 — Format lot number — remove spaces ────────────────────
        // Format: PRODUCTFGLOT-001-COMPANYCODE-YY-PMFGLOT
      
        String lotNumber = String.format("%s%03d%s%s%s",
                productFgLotCode,
                nextLot,
                companyCode,
                year,
                pmFgLotCode)
                .replace(" ", "");

        return lotNumber;
    }
}