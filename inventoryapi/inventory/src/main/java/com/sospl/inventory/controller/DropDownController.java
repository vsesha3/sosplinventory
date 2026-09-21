package com.sospl.inventory.controller;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.service.DropDownService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dropdown")
public class DropDownController {

    private final DropDownService service;

    public DropDownController(DropDownService service) {
        this.service = service;
    }

    // ── Generic dropdown by type ──────────────────────────────────────────
    @GetMapping("/{type}")
    public ResponseEntity<ApiResponse<List<DropDownResponse>>> getDropdown(
            @PathVariable String type) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        type + " dropdown fetched successfully",
                        service.getDropdown(type)));
    }
}