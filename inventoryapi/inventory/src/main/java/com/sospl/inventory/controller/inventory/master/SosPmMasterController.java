package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.inventory.master.SosPmMasterResponse;
import com.sospl.inventory.model.SosWorkOrder;
import com.sospl.inventory.model.inventory.master.SosPmMaster;
import com.sospl.inventory.service.SosWorkOrderService;
import com.sospl.inventory.service.inventory.master.SosPmMasterService;
import com.sospl.inventory.util.ParseUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pm")
public class SosPmMasterController {

    private final SosPmMasterService service;
    private final SosWorkOrderService workOrderService;

    public SosPmMasterController(SosPmMasterService service,SosWorkOrderService _workOrderService) {
        this.service = service;
        this.workOrderService = _workOrderService;
    }

    // Create
    @PostMapping
    public ResponseEntity<ApiResponse<SosPmMaster>> create(
            @RequestBody SosPmMaster entity) {
        return ResponseEntity.ok(
                ApiResponse.success("PM created successfully",
                        service.save(entity)));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SosPmMaster>> update(
            @PathVariable Integer id,
            @RequestBody SosPmMaster entity) {
        return ResponseEntity.ok(
                ApiResponse.success("PM updated successfully",
                        service.update(id, entity)));
    }

    // Get by id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosPmMaster>> getById(
            @PathVariable Integer id) {
        return ResponseEntity.ok(
                ApiResponse.success("PM fetched successfully",
                        service.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                        "PM not found"))));
    }

    // Get all without pagination
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<SosPmMaster>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.success("PMs fetched successfully",
                        service.findAll()));
    }
    
    @GetMapping("/wo/{id}")
    public ResponseEntity<ApiResponse<SosPmMaster>> getPmDetilsByWoID(
            @PathVariable Long id) {

        // Step 1 — Get work orders by pm_id
       
        
        SosWorkOrder workOrder = workOrderService
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Work order not found: " + id));

        
        // Step 2 — Get pmId from first work order
        Long pmId = workOrder.getPmId();

        if (pmId == null) {
            throw new RuntimeException(
                    "PM not mapped for work order: " + id);
        }

        // Step 3 — Cast Long to Integer for findById
        Integer pmIdInt = pmId.intValue();

        // Step 4 — Get PM by pmId
        return ResponseEntity.ok(
                ApiResponse.success(
                        "PM fetched successfully",
                        service.findById(pmIdInt)
                                .orElseThrow(() -> new RuntimeException(
                                        "PM not found: " + pmIdInt))));
    }

    // Get all with details without pagination
    @GetMapping("/details")
    public ResponseEntity<ApiResponse<List<SosPmMasterResponse>>> getAllWithDetails() {
        return ResponseEntity.ok(
                ApiResponse.success("PMs fetched successfully",
                        service.findAllWithDetails()));
    }

    // Get all paginated
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<SosPmMasterResponse>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "pmId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        return ResponseEntity.ok(
                ApiResponse.success("PMs fetched successfully",
                        service.findAllPaginated(page, size, sortBy, sortDir)));
    }

    // Search with pagination
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<SosPmMasterResponse>>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "pmId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        return ResponseEntity.ok(
                ApiResponse.success("Search results fetched successfully",
                        service.search(keyword, page, size, sortBy, sortDir)));
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.ok(
                ApiResponse.success("PM deleted successfully"));
    }
    
    
    @GetMapping("/dropdown")
    public ResponseEntity<ApiResponse<List<DropDownResponse>>> getDropdown() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "PM dropdown fetched successfully",
                        service.findAllForDropDown()));
    }
}