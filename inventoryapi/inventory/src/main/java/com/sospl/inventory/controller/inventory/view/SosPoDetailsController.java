package com.sospl.inventory.controller.inventory.view;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.inventory.view.SosPoDetailsResponse;
import com.sospl.inventory.service.inventory.view.SosPoDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/po-details")
public class SosPoDetailsController {

    private final SosPoDetailsService service;

    public SosPoDetailsController(SosPoDetailsService service) {
        this.service = service;
    }

    // Get all details by po_ref_no
    @GetMapping("/{poRefNo}")
    public ResponseEntity<ApiResponse<List<SosPoDetailsResponse>>> getByPoRefNo(
            @PathVariable Long poRefNo) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "PO details fetched successfully",
                        service.findByPoRefNo(poRefNo)));
    }
}