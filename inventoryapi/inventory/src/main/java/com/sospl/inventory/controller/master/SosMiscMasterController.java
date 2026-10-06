package com.sospl.inventory.controller.master;

import com.sospl.inventory.model.master.SosMiscMaster;
import com.sospl.inventory.service.master.SosMiscMasterService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/misc-master")
@CrossOrigin(origins = "*")
public class SosMiscMasterController {

    private final SosMiscMasterService service;

    public SosMiscMasterController(
            SosMiscMasterService service) {
        this.service = service;
    }

    // Get all
    @GetMapping
    public ResponseEntity<List<SosMiscMaster>> getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }

    // Get active records
    @GetMapping("/active")
    public ResponseEntity<List<SosMiscMaster>> getActive() {

        return ResponseEntity.ok(
                service.getActive()
        );
    }

    // Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<SosMiscMaster> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }

    // Get by code
    @GetMapping("/code/{code}")
    public ResponseEntity<SosMiscMaster> getByCode(
            @PathVariable String code) {

        return ResponseEntity.ok(
                service.getByCode(code)
        );
    }

    // Create
    @PostMapping
    public ResponseEntity<SosMiscMaster> create(
            @RequestBody SosMiscMaster miscMaster) {

        SosMiscMaster saved =
                service.save(miscMaster);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<SosMiscMaster> update(
            @PathVariable Long id,
            @RequestBody SosMiscMaster miscMaster) {

        SosMiscMaster updated =
                service.update(id, miscMaster);

        return ResponseEntity.ok(updated);
    }

    // Delete / deactivate
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}