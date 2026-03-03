package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.model.inventory.master.SosTransporterMaster;
import com.sospl.inventory.service.inventory.master.SosTransporterMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transporter")
public class SosTransporterMasterController {

    private final SosTransporterMasterService service;

    public SosTransporterMasterController(SosTransporterMasterService service) {
        this.service = service;
    }

    @PostMapping
    public SosTransporterMaster create(@RequestBody SosTransporterMaster entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public SosTransporterMaster update(@PathVariable Long id, @RequestBody SosTransporterMaster entity) {
        return service.update(id, entity);
    }

    @GetMapping("/{id}")
    public SosTransporterMaster getById(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }

    @GetMapping
    public List<SosTransporterMaster> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public Page<SosTransporterMaster> getAllWithPagination(Pageable pageable) {
        return service.findAll(pageable);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
