package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.model.inventory.master.SosAreaMaster;
import com.sospl.inventory.service.inventory.master.SosAreaMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/area")
public class SosAreaMasterController {

    private final SosAreaMasterService service;

    public SosAreaMasterController(SosAreaMasterService service) {
        this.service = service;
    }

    @PostMapping
    public SosAreaMaster create(@RequestBody SosAreaMaster entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public SosAreaMaster update(@PathVariable Long id, @RequestBody SosAreaMaster entity) {
        return service.update(id, entity);
    }

    @GetMapping("/{id}")
    public SosAreaMaster getById(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }

    @GetMapping
    public List<SosAreaMaster> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public Page<SosAreaMaster> getAllWithPagination(Pageable pageable) {
        return service.findAll(pageable);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
