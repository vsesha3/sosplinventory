package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.model.inventory.master.SosCapitalGoodsMaster;
import com.sospl.inventory.service.inventory.master.SosCapitalGoodsMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/capitalgoods")
public class SosCapitalGoodsMasterController {

    private final SosCapitalGoodsMasterService service;

    public SosCapitalGoodsMasterController(SosCapitalGoodsMasterService service) {
        this.service = service;
    }

    @PostMapping
    public SosCapitalGoodsMaster create(@RequestBody SosCapitalGoodsMaster entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public SosCapitalGoodsMaster update(@PathVariable Long id, @RequestBody SosCapitalGoodsMaster entity) {
        return service.update(id, entity);
    }

    @GetMapping("/{id}")
    public SosCapitalGoodsMaster getById(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }

    @GetMapping
    public List<SosCapitalGoodsMaster> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public Page<SosCapitalGoodsMaster> getAllWithPagination(Pageable pageable) {
        return service.findAll(pageable);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
