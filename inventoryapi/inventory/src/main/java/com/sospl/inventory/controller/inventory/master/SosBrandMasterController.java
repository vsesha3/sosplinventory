package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.model.inventory.master.SosBrandMaster;
import com.sospl.inventory.service.inventory.master.SosBrandMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brand")
public class SosBrandMasterController {

    private final SosBrandMasterService service;

    public SosBrandMasterController(SosBrandMasterService service) {
        this.service = service;
    }

    @PostMapping
    public SosBrandMaster create(@RequestBody SosBrandMaster entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public SosBrandMaster update(@PathVariable Long id, @RequestBody SosBrandMaster entity) {
        return service.update(id, entity);
    }

    @GetMapping("/{id}")
    public SosBrandMaster getById(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }

    @GetMapping
    public List<SosBrandMaster> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public Page<SosBrandMaster> getAllWithPagination(Pageable pageable) {
        return service.findAll(pageable);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
