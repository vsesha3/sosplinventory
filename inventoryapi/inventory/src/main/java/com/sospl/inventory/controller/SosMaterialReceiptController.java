package com.sospl.inventory.controller;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.inventory.SosMaterialReceiptDetRequest;
import com.sospl.inventory.dto.inventory.SosMaterialReceiptLineRequest;
import com.sospl.inventory.dto.inventory.SosMaterialReceiptSummaryResponse;
import com.sospl.inventory.dto.inventory.SosMaterialReceiptWithRMDetailsResponse;
import com.sospl.inventory.model.SosMaterialReceipt;
import com.sospl.inventory.model.SosMaterialReceiptDet;
import com.sospl.inventory.service.SosMaterialReceiptService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/material-receipt")
public class SosMaterialReceiptController {

    private final SosMaterialReceiptService service;

    public SosMaterialReceiptController(
            SosMaterialReceiptService service) {
        this.service = service;
    }
    
    
    
 // Get header by po ref no
 // REMOVE orElseThrow — return null instead
    @GetMapping("/header/po/{poRefNo}")
    public ResponseEntity<ApiResponse<SosMaterialReceiptDet>> getHeaderByPoRefNo(
            @PathVariable Long poRefNo,
            @RequestParam(required = false) String materialType) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Header fetched successfully",
                        service.findHeaderByPoRefNo(poRefNo)
                                .orElse(null))); // ← return null if not found
    }
    
    
    
    
    
    @PostMapping("/save")
    public ResponseEntity<ApiResponse<Long>> saveReceipt(
            @RequestBody SosMaterialReceiptDetRequest request) {
        Long receiptDetId = service.saveReceipt(request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Receipt saved successfully",
                        receiptDetId));
    }


    // ── Static paths FIRST — /{id} LAST ──────────────────────────────────

    // Get all by material type — non paginated
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<SosMaterialReceipt>>> getAllByMaterialType(
            @RequestParam String materialType) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Receipts fetched successfully",
                        service.findAllByMaterialType(materialType)));
    }

    // Get all by material type — paginated
    @GetMapping
    public ResponseEntity<ApiResponse<Page<SosMaterialReceipt>>> getAllPaginated(
            @RequestParam String materialType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Receipts fetched successfully",
                        service.findAllByMaterialType(
                                materialType, pageable)));
    }

    // Search
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<SosMaterialReceipt>>> search(
            @RequestParam String materialType,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by("createdAt").descending());
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Search results fetched successfully",
                        service.search(materialType, keyword, pageable)));
    }

    // Get by po ref no and material type
    @GetMapping("/po/{poRefNo}")
    public ResponseEntity<ApiResponse<List<SosMaterialReceipt>>> getByPoRefNo(
            @PathVariable Long poRefNo,
            @RequestParam String materialType) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Receipts fetched successfully",
                        service.findByPoRefNo(poRefNo, materialType)));
    }
    
 
    @GetMapping("/rmlist/{rmDetId}")
    public ResponseEntity<ApiResponse<List<SosMaterialReceiptLineRequest>>> getByRmDetId(
            @PathVariable Long rmDetId) {
    	
    	System.out.println("here test");
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Receipts fetched successfully",
                        service.findFullReceiptByReceiptDetId(rmDetId).getLines()));
    }

    // Create
    @PostMapping
    public ResponseEntity<ApiResponse<SosMaterialReceipt>> create(
            @RequestBody SosMaterialReceipt request) {
        SosMaterialReceipt saved = service.save(request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Receipt created successfully", saved));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SosMaterialReceipt>> update(
            @PathVariable Long id,
            @RequestBody SosMaterialReceipt request) {
        SosMaterialReceipt updated = service.update(id, request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Receipt updated successfully", updated));
    }

    // Soft Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @RequestParam(defaultValue = "system") String deletedBy) {
        service.softDelete(id, deletedBy);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Receipt deleted successfully", null));
    }
    
 // Get receipt summary — all
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<List<SosMaterialReceiptSummaryResponse>>> getSummary() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Receipt summary fetched successfully",
                        service.findAllReceiptSummary()));
    }

    // Get receipt summary — by material type
    @GetMapping("/summary/type")
    public ResponseEntity<ApiResponse<List<SosMaterialReceiptSummaryResponse>>> getSummaryByMaterialType(
            @RequestParam String materialType) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Receipt summary fetched successfully",
                        service.findAllReceiptSummaryByMaterialType(
                                materialType)));
    }
    
    @GetMapping("/summary/porefno/{poRefNo}")
    public ResponseEntity<ApiResponse<List<SosMaterialReceiptSummaryResponse>>> getSummaryByPoRefNo(
            @PathVariable Long poRefNo) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Receipt summary fetched successfully",
                        service.findAllReceiptSummaryByPoRefNo(
                                poRefNo)));
    }
    
 
    // Get by id — ALWAYS LAST
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosMaterialReceipt>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Receipt fetched successfully",
                        service.findById(id).orElseThrow(
                                () -> new RuntimeException(
                                        "Receipt not found: " + id))));
    }
}