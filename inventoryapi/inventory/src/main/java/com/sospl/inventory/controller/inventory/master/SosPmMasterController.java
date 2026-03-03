package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.model.inventory.master.SosPmMaster;
import com.sospl.inventory.service.inventory.master.SosPmMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pm")
public class SosPmMasterController {

    private final SosPmMasterService service;

    public SosPmMasterController(SosPmMasterService service) {
        this.service = service;
    }

    @PostMapping
    public SosPmMaster create(@RequestBody SosPmMaster entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public SosPmMaster update(@PathVariable Long id, @RequestBody SosPmMaster entity) {
        return service.update(id, entity);
    }

    @GetMapping("/{id}")
    public SosPmMaster getById(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }

    @GetMapping
    public List<SosPmMaster> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public Page<SosPmMaster> getAllWithPagination(Pageable pageable) {
        return service.findAll(pageable);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
