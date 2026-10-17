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
    	
    	type = type.toLowerCase().trim();
    	Long productId = null;
    	
    	
    	 if (type.startsWith("product-pm-list_")) {

    	        String productIdStr = type.substring("product-pm-list_".length());
    	       

    	        try {
    	            
    	        	productId = Long.parseLong(productIdStr);
    	            return repository.getPoductPmListDropDown(productId);

    	        } catch (NumberFormatException e) {
    	            throw new RuntimeException(
    	                "Invalid product ID in dropdown type: " + type
    	            );
    	        }
	     }

    	
    	 
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
            case "supplier-list" ->repository.getSupplierListForDropDown("SUPPLIER");
            case "transporter_list" ->repository.getTransporterListForDropDown();
            case "packing-master"->repository.getPackingMasterForDropDown();
            case "brand-name"->repository.getBrandNameForDropdown();
            case "plant-name"->repository.getMiscNameForDropdown("plant");
            case "company-list"->repository.getMiscNameForDropdown("company");
            case "user-list"->repository.getUserListForDropdown(null);
            case "vessel-list"->repository.getMiscNameForDropdown("vessel");
            case "wo-list"->repository.getWorkOrderListForDropDown();
            case "customer-list" ->repository.getSupplierListForDropDown("CUSTOMER");

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
