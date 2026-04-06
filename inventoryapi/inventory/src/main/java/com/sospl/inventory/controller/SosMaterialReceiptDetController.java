package com.sospl.inventory.controller;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.inventory.SosMaterialReceiptDetRequest;
import com.sospl.inventory.service.SosMaterialReceiptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/material-receipt-det")
public class SosMaterialReceiptDetController {

    private final SosMaterialReceiptService service;

    public SosMaterialReceiptDetController(
            SosMaterialReceiptService service) {
        this.service = service;
    }

    // ── Static paths FIRST — /{id} LAST ──────────────────────────────────

    // Get all receipts by poRefNo — returns list since one PO can have multiple receipts
    @GetMapping("/po/{poRefNo}")
    public ResponseEntity<ApiResponse<List<SosMaterialReceiptDetRequest>>> getAllByPoRefNo(
            @PathVariable Long poRefNo) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Receipts fetched successfully",
                        service.findFullReceiptByPoRefNo(poRefNo)));
    }

    // Get full receipt by receiptDetId — single record
    @GetMapping("/{receiptDetId}")
    public ResponseEntity<ApiResponse<SosMaterialReceiptDetRequest>> getByReceiptDetId(
            @PathVariable Long receiptDetId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Receipt fetched successfully",
                        service.findFullReceiptByReceiptDetId(
                                receiptDetId)));
    }
}