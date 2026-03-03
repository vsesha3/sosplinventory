package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.model.inventory.master.SosProductMaster;
import com.sospl.inventory.service.inventory.master.SosProductMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
public class SosProductMasterController {

    private final SosProductMasterService service;

    public SosProductMasterController(SosProductMasterService service) {
        this.service = service;
    }

    @PostMapping
    public SosProductMaster create(@RequestBody SosProductMaster entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public SosProductMaster update(@PathVariable Long id, @RequestBody SosProductMaster entity) {
        return service.update(id, entity);
    }

    @GetMapping("/{id}")
    public SosProductMaster getById(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }

    @GetMapping
    public List<SosProductMaster> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public Page<SosProductMaster> getAllWithPagination(Pageable pageable) {
        return service.findAll(pageable);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
