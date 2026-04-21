package com.sospl.inventory.controller;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.model.SosWorkOrder;
import com.sospl.inventory.model.master.SosProdMasterPmDetls;
import com.sospl.inventory.service.LotNumberService;
import com.sospl.inventory.service.SosWorkOrderService;
import com.sospl.inventory.service.master.SosProdMasterPmDetlsService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory/lot-number")
public class LotNumberController {

    private final LotNumberService lotNumberService;
    private final SosProdMasterPmDetlsService pmDetlsService;
    private final SosWorkOrderService sosWorkOrderService;


    public LotNumberController(LotNumberService lotNumberService,SosProdMasterPmDetlsService _pmDetlsService,SosWorkOrderService _sosWorkOrderService) {
        this.lotNumberService = lotNumberService;
        this.pmDetlsService  = _pmDetlsService;
        this.sosWorkOrderService = _sosWorkOrderService;
    }

    @GetMapping("/generate/{woId}")
    public ResponseEntity<ApiResponse<String>> generateLotNumber(
            @PathVariable Long woId) {

        // Step 1 — Get product_id from work order
        
        
        SosWorkOrder workOrder = sosWorkOrderService
                .findById(woId)
                .orElseThrow(() -> new RuntimeException(
                        "Work order not found: " + woId));
        

        // Step 2 — Get pm_id from product_id
       
        // Step 3 — Use first pmId from mapping
        Long pmId = workOrder.getPmId();
        System.out.println(pmId);

        // Step 4 — Generate lot number
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Lot number generated successfully",
                        lotNumberService.generateLotNumber(
                                woId, pmId)));
    }
}