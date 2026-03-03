package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.model.inventory.master.SosQcTestMaster;
import com.sospl.inventory.service.inventory.master.SosQcTestMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/qctest")
public class SosQcTestMasterController {

    private final SosQcTestMasterService service;

    public SosQcTestMasterController(SosQcTestMasterService service) {
        this.service = service;
    }

    @PostMapping
    public SosQcTestMaster create(@RequestBody SosQcTestMaster entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public SosQcTestMaster update(@PathVariable Long id, @RequestBody SosQcTestMaster entity) {
        return service.update(id, entity);
    }

    @GetMapping("/{id}")
    public SosQcTestMaster getById(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }

    @GetMapping
    public List<SosQcTestMaster> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public Page<SosQcTestMaster> getAllWithPagination(Pageable pageable) {
        return service.findAll(pageable);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
