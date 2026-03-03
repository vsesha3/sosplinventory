package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.model.inventory.master.SosCustomerMaster;
import com.sospl.inventory.service.inventory.master.SosCustomerMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
public class SosCustomerMasterController {

    private final SosCustomerMasterService service;

    public SosCustomerMasterController(SosCustomerMasterService service) {
        this.service = service;
    }

    @PostMapping
    public SosCustomerMaster create(@RequestBody SosCustomerMaster entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public SosCustomerMaster update(@PathVariable Long id, @RequestBody SosCustomerMaster entity) {
        return service.update(id, entity);
    }

    @GetMapping("/{id}")
    public SosCustomerMaster getById(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }

    @GetMapping
    public List<SosCustomerMaster> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public Page<SosCustomerMaster> getAllWithPagination(Pageable pageable) {
        return service.findAll(pageable);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
