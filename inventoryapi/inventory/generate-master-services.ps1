# ===============================
# CONFIGURATION
# ===============================

$basePath = "src/main/java/com/sospl/inventory"
$servicePath = "$basePath/service/inventory/master"
$implPath = "$servicePath/impl"

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
# CREATE DIRECTORIES
# ===============================

New-Item -ItemType Directory -Force -Path $servicePath | Out-Null
New-Item -ItemType Directory -Force -Path $implPath | Out-Null

# ===============================
# GENERATE FILES
# ===============================

foreach ($master in $masters) {

    $entityName = $master
    $repoName = "${master}Repository"
    $serviceName = "${master}Service"
    $implName = "${master}ServiceImpl"

    # -------------------------------
    # SERVICE INTERFACE
    # -------------------------------

    $serviceContent = @"
package com.sospl.inventory.service.inventory.master;

import com.sospl.inventory.model.inventory.master.$entityName;
import com.sospl.inventory.service.common.BaseMasterService;

public interface $serviceName
        extends BaseMasterService<$entityName, Long> {

}
"@

    $serviceFile = "$servicePath/$serviceName.java"

    if (!(Test-Path $serviceFile)) {
        Set-Content -Path $serviceFile -Value $serviceContent
        Write-Host "Created $serviceName"
    } else {
        Write-Host "$serviceName already exists - Skipped"
    }

    # -------------------------------
    # SERVICE IMPLEMENTATION
    # -------------------------------

    $implContent = @"
package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.model.inventory.master.$entityName;
import com.sospl.inventory.repository.inventory.master.$repoName;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.inventory.master.$serviceName;
import org.springframework.stereotype.Service;

@Service
public class $implName
        extends BaseMasterServiceImpl<$entityName, Long>
        implements $serviceName {

    public $implName($repoName repository) {
        super(repository);
    }
}
"@

    $implFile = "$implPath/$implName.java"

    if (!(Test-Path $implFile)) {
        Set-Content -Path $implFile -Value $implContent
        Write-Host "Created $implName"
    } else {
        Write-Host "$implName already exists - Skipped"
    }
}

Write-Host "✅ All master services generated successfully!"