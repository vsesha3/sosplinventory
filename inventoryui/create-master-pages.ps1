# Run from INVENTORYUI root
# Creates placeholder components for all Master pages

$masters = @(
    "country",
    "transporter",
    "product-group",
    "rm-group",
    "pm-group",
    "uom",
    "customer",
    "product",
    "raw-material",
    "packing-material",
    "supplier",
    "capital-goods",
    "lab-test",
    "subitem",
    "miscellaneous",
    "brand"
)

$labels = @{
    "country"           = "Country Master"
    "transporter"       = "Transporter Master"
    "product-group"     = "Product Group Master"
    "rm-group"          = "RM Group Master"
    "pm-group"          = "PM Group Master"
    "uom"               = "UOM Master"
    "customer"          = "Customer Master"
    "product"           = "Product Master"
    "raw-material"      = "Raw Material Master"
    "packing-material"  = "Packing Material Master"
    "supplier"          = "Supplier Master"
    "capital-goods"     = "Capital Goods Master"
    "lab-test"          = "Lab Test Master"
    "subitem"           = "Subitem Master"
    "miscellaneous"     = "Miscellaneous Master"
    "brand"             = "Brand Master"
}

New-Item -ItemType Directory -Force -Path "src\pages\masters" | Out-Null

foreach ($master in $masters) {
    $label = $labels[$master]
    # Convert kebab-case to PascalCase for component name
    $componentName = ($master -split '-' | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1) }) -join ''
    $componentName = "${componentName}Page"
    $fileName = "src\pages\masters\${componentName}.tsx"

    $content = @"
import React from 'react';
import { Title, Text, Box, Paper } from '@mantine/core';

const ${componentName}: React.FC = () => {
  return (
    <Box>
      <Title order={3} mb="xs">${label}</Title>
      <Text c="dimmed" size="sm" mb="lg">Manage ${label} records</Text>
      <Paper withBorder p="xl" ta="center" c="dimmed">
        ${label} — coming soon
      </Paper>
    </Box>
  );
};

export default ${componentName};
"@

    Set-Content -Path $fileName -Value $content
    Write-Host "  [+] $fileName" -ForegroundColor Green
}

Write-Host ""
Write-Host "All master placeholder pages created!" -ForegroundColor Cyan
