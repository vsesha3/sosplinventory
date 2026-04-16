package com.sospl.inventory.controller;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.repository.SosVesselMasterRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/misc")
public class MisculaniousController {

    private final SosVesselMasterRepository vesselRepository;

    public MisculaniousController(
            SosVesselMasterRepository vesselRepository) {
        this.vesselRepository = vesselRepository;
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
}