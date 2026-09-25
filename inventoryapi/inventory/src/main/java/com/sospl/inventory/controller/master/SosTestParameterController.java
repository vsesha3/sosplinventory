package com.sospl.inventory.controller.master;

import com.sospl.inventory.model.master.SosTestParameter;
import com.sospl.inventory.service.master.SosTestParameterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-parameters")
public class SosTestParameterController {

    private final SosTestParameterService service;

    public SosTestParameterController(SosTestParameterService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<SosTestParameter>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{paramId}")
    public ResponseEntity<SosTestParameter> getById(
            @PathVariable Long paramId) {

        return service.getById(paramId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/test/{testId}")
    public ResponseEntity<List<SosTestParameter>> getByTestId(
            @PathVariable Long testId) {

        return ResponseEntity.ok(service.getByTestId(testId));
    }

    @GetMapping("/test/{testId}/active")
    public ResponseEntity<List<SosTestParameter>> getActiveByTestId(
            @PathVariable Long testId) {

        return ResponseEntity.ok(service.getActiveByTestId(testId));
    }

    @PostMapping
    public ResponseEntity<SosTestParameter> create(
            @RequestBody SosTestParameter parameter) {

        return ResponseEntity.ok(service.save(parameter));
    }

    @PutMapping("/{paramId}")
    public ResponseEntity<SosTestParameter> update(
            @PathVariable Long paramId,
            @RequestBody SosTestParameter parameter) {

        return service.getById(paramId)
                .map(existing -> {
                    existing.setTestId(parameter.getTestId());
                    existing.setMethod(parameter.getMethod());
                    existing.setLimits(parameter.getLimits());
                    existing.setSpecification(parameter.getSpecification());

                    return ResponseEntity.ok(service.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{paramId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long paramId) {

        if (service.getById(paramId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        service.delete(paramId);
        return ResponseEntity.noContent().build();
    }
}