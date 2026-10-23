package com.sospl.inventory.controller;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.repository.SosVesselMasterRepository;
import com.sospl.inventory.service.SosMiscService;
import com.sospl.inventory.service.master.SosMiscMasterService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/misc")
public class MisculaniousController {

    private final SosVesselMasterRepository vesselRepository;
    
    private final SosMiscService miscmMasterService;
    
    
    public MisculaniousController(
            SosVesselMasterRepository vesselRepository,SosMiscService miscmMasterService) {
        this.vesselRepository = vesselRepository;
        this.miscmMasterService = miscmMasterService;
    }

    @GetMapping("/vessels/dropdown")
    public ResponseEntity<ApiResponse<List<DropDownResponse>>> getVesselDropdown() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Vessel dropdown fetched successfully",
                        vesselRepository
                                .findAllByIsActiveTrueAndIsDeletedFalse()
                                .stream()
                                .filter(v -> v.getVesselId() != null)
                                .map(v -> new DropDownResponse(
                                        v.getVesselId(),
                                        v.getVesselName() != null
                                                ? v.getVesselName()
                                                : "-"))
                                .collect(Collectors.toList())));
    }
    
   
    
    @GetMapping("/wo-details/{woId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getWoDetails(
            @PathVariable Long woId,
            @RequestParam(required = false) Long rmReqId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "WO details fetched successfully",
                        miscmMasterService.getWoDetails(woId, rmReqId)));
    }
}
