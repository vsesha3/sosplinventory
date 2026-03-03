package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.model.inventory.master.SosUomMaster;
import com.sospl.inventory.service.inventory.master.SosUomMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/uom")
public class SosUomMasterController {

    private final SosUomMasterService service;

    public SosUomMasterController(SosUomMasterService service) {
        this.service = service;
    }

    @PostMapping
    public SosUomMaster create(@RequestBody SosUomMaster entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public SosUomMaster update(@PathVariable Long id, @RequestBody SosUomMaster entity) {
        return service.update(id, entity);
    }

    @GetMapping("/{id}")
    public SosUomMaster getById(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }

    @GetMapping
    public List<SosUomMaster> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public Page<SosUomMaster> getAllWithPagination(Pageable pageable) {
        return service.findAll(pageable);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
