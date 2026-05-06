package com.sospl.inventory.controller.inventory;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.model.inventory.SosRmStockFifoView;
import com.sospl.inventory.service.inventory.SosRmStockFifoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/rm-stock")
public class SosRmStockFifoController {

    private final SosRmStockFifoService service;

    public SosRmStockFifoController(
            SosRmStockFifoService service) {
        this.service = service;
    }

    // ── Static paths FIRST — /{id} LAST ──────────────────────────────────

    // Get all FIFO stock
    @GetMapping
    public ResponseEntity<ApiResponse<List<SosRmStockFifoView>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM stock fetched successfully",
                        service.findAll()));
    }

    // Get by rmId — FIFO
    @GetMapping("/rm/{rmId}")
    public ResponseEntity<ApiResponse<List<SosRmStockFifoView>>> getByRmId(
            @PathVariable Long rmId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM stock fetched successfully",
                        service.findByRmId(rmId)));
    }

    // Get by rmCode — FIFO
    @GetMapping("/code/{rmCode}")
    public ResponseEntity<ApiResponse<List<SosRmStockFifoView>>> getByRmCode(
            @PathVariable Long rmCode) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "RM stock fetched successfully",
                        service.findByRmCode(rmCode)));
    }
}