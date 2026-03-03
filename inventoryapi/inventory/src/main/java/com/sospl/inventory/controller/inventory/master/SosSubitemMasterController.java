package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.model.inventory.master.SosSubitemMaster;
import com.sospl.inventory.service.inventory.master.SosSubitemMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subitem")
public class SosSubitemMasterController {

    private final SosSubitemMasterService service;

    public SosSubitemMasterController(SosSubitemMasterService service) {
        this.service = service;
    }

    @PostMapping
    public SosSubitemMaster create(@RequestBody SosSubitemMaster entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public SosSubitemMaster update(@PathVariable Long id, @RequestBody SosSubitemMaster entity) {
        return service.update(id, entity);
    }

    @GetMapping("/{id}")
    public SosSubitemMaster getById(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }

    @GetMapping
    public List<SosSubitemMaster> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public Page<SosSubitemMaster> getAllWithPagination(Pageable pageable) {
        return service.findAll(pageable);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
