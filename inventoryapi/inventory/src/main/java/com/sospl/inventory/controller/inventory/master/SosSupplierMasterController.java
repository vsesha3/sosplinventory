package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.model.inventory.master.SosSupplierMaster;
import com.sospl.inventory.service.inventory.master.SosSupplierMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supplier")
public class SosSupplierMasterController {

    private final SosSupplierMasterService service;

    public SosSupplierMasterController(SosSupplierMasterService service) {
        this.service = service;
    }

    @PostMapping
    public SosSupplierMaster create(@RequestBody SosSupplierMaster entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public SosSupplierMaster update(@PathVariable Long id, @RequestBody SosSupplierMaster entity) {
        return service.update(id, entity);
    }

    @GetMapping("/{id}")
    public SosSupplierMaster getById(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }

    @GetMapping
    public List<SosSupplierMaster> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public Page<SosSupplierMaster> getAllWithPagination(Pageable pageable) {
        return service.findAll(pageable);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
