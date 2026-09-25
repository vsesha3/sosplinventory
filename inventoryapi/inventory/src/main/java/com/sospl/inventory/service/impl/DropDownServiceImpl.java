package com.sospl.inventory.service.impl;

import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.repository.DropDownRepository;
import com.sospl.inventory.service.DropDownService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DropDownServiceImpl implements DropDownService {

    private final DropDownRepository repository;

    public DropDownServiceImpl(DropDownRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<DropDownResponse> getDropdown(String type) {
        return switch (type.toLowerCase().trim()) {

            // ── Master tables ─────────────────────────────────────────────
            case "uom"          -> repository.getUomDropdown();
            case "rm-group"     -> repository.getRmGroupDropdown();
            case "test-master"  -> repository.getTestMasterDropdown();
            case "vessel"       -> repository.getVesselDropdown();
            case "pm"           -> repository.getPmDropdown();
            case "product"      -> repository.getProductDropdown();
            case "supplier"     -> repository.getSupplierDropdown();
            case "rm"           -> repository.getRmDropdown();
            case "work-order"   -> repository.getWorkOrderDropdown();
            case "company"      -> repository.getCompanyDropdown();
            case "transporter"  -> repository.getTransporterDropdown();
            case "rm-stock"     -> repository.getRmStockDropdown();
            case "product-group" -> repository.getProductGroupDropDown();
            case "supplier-type" ->repository.getSupplierTypeDropDown();
            case "country-list" ->repository.getCountryListForDropDown();
            case "supplier-list" ->repository.getSupplierListForDropDown();
            case "transporter_list" ->repository.getTransporterListForDropDown();

            // ── Unknown type ──────────────────────────────────────────────
            default -> throw new RuntimeException(
                    "Unknown dropdown type: " + type
                    + ". Supported types: uom, rm-group, "
                    + "test-master, vessel, pm, product, "
                    + "supplier, rm, work-order, company, "
                    + "transporter, rm-stock");
        };
    }
}
