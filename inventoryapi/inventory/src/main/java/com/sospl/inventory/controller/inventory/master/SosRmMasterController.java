package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.dto.inventory.master.SosRmMasterRequest;
import com.sospl.inventory.dto.inventory.master.SosRmMasterResponse;
import com.sospl.inventory.service.inventory.master.SosRmMasterService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rm")
public class SosRmMasterController {

    private final SosRmMasterService service;

    public SosRmMasterController(SosRmMasterService service) {
        this.service = service;
    }

    // ===============================
    // CREATE
    // ===============================
    @PostMapping
    public SosRmMasterResponse create(
            @Valid @RequestBody SosRmMasterRequest request) {
        return service.create(request);
    }

    // ===============================
    // UPDATE
    // ===============================
    @PutMapping("/{id}")
    public SosRmMasterResponse update(
            @PathVariable Integer id,
            @Valid @RequestBody SosRmMasterRequest request) {
        return service.update(id, request);
    }

    // ===============================
    // GET BY ID
    // ===============================
    @GetMapping("/{id}")
    public SosRmMasterResponse getById(@PathVariable Integer id) {
        return service.findById(id);
    }

    // ===============================
    // GET ALL (List Screen)
    // ===============================
    @GetMapping
    public List<SosRmMasterResponse> getAll() {
        return service.findAll();
    }

    // ===============================
    // DELETE
    // ===============================
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}