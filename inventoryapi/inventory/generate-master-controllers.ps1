# ===============================
# CONFIGURATION
# ===============================

$basePath = "src/main/java/com/sospl/inventory/controller/inventory/master"

$masters = @(
    "SosUomMaster",
    "SosRmMaster",
    "SosPmMaster",
    "SosCapitalGoodsMaster",
    "SosProductMaster",
    "SosCustomerMaster",
    "SosSupplierMaster",
    "SosAreaMaster",
    "SosBrandMaster",
    "SosQcTestMaster",
    "SosSubitemMaster",
    "SosTransporterMaster",
    "SosProductGroupMaster"
)

# ===============================
# CREATE DIRECTORY IF NOT EXISTS
# ===============================

New-Item -ItemType Directory -Force -Path $basePath | Out-Null

# ===============================
# GENERATE CONTROLLERS
# ===============================

foreach ($master in $masters) {

    $entityName = $master
    $serviceName = "${master}Service"
    $controllerName = "${master}Controller"

    # Generate endpoint name dynamically
    $endpoint = ($master -replace "^Sos","" -replace "Master$","").ToLower()

    $content = @"
package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.model.inventory.master.$entityName;
import com.sospl.inventory.service.inventory.master.$serviceName;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/$endpoint")
public class $controllerName {

    private final $serviceName service;

    public $controllerName($serviceName service) {
        this.service = service;
    }

    @PostMapping
    public $entityName create(@RequestBody $entityName entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public $entityName update(@PathVariable Long id, @RequestBody $entityName entity) {
        return service.update(id, entity);
    }

    @GetMapping("/{id}")
    public $entityName getById(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }

    @GetMapping
    public List<$entityName> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public Page<$entityName> getAllWithPagination(Pageable pageable) {
        return service.findAll(pageable);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
"@

    $filePath = "$basePath/$controllerName.java"

    if (!(Test-Path $filePath)) {
        Set-Content -Path $filePath -Value $content
        Write-Host "Created $controllerName"
    } else {
        Write-Host "$controllerName already exists - Skipped"
    }
}

Write-Host "✅ All master controllers generated successfully!"