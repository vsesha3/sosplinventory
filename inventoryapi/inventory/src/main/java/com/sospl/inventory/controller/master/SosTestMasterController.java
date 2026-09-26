package com.sospl.inventory.controller.master;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.master.SosTestMasterRequest;
import com.sospl.inventory.model.master.SosTestMaster;
import com.sospl.inventory.model.master.SosTestParameter;
import com.sospl.inventory.service.master.SosTestMasterService;
import com.sospl.inventory.service.master.SosTestParameterService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory/test-master")
public class SosTestMasterController {

    private final SosTestMasterService service;
    private final SosTestParameterService parameterService;

    public SosTestMasterController(SosTestMasterService service,SosTestParameterService parameterService) {
        this.service = service;
        this.parameterService = parameterService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SosTestMaster>> create(
            @RequestBody SosTestMasterRequest request) {

        SosTestMaster entity = new SosTestMaster();

        entity.setTestCode(request.getTestCode());
        entity.setTestName(request.getTestName());
        entity.setTestId(request.getTestId());

        // Save Test Master first
        SosTestMaster savedMaster = service.save(entity);

        // Save Test Parameters
        if (request.getParameters() != null) {

            for (SosTestParameter parameter : request.getParameters()) {

                // Associate parameter with newly created Test Master
                parameter.setTestId(savedMaster.getTestId());

                // paramId should be null for new parameters
                parameterService.save(parameter);
            }
        }

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Test master and parameters created successfully",
                        savedMaster));
    }
    
    
    @GetMapping("/dropdown")
    public ResponseEntity<ApiResponse<List<DropDownResponse>>> getDropDown() {
        return ResponseEntity.ok(
                ApiResponse.success("RMs fetched successfully",
                        service.findAllForDropDown()));
    }

    // Update
 
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SosTestMaster>> update(
            @PathVariable Long id,
            @RequestBody SosTestMasterRequest request) {

        System.out.println("========== TEST MASTER UPDATE ==========");
        System.out.println("Master ID: " + id);
        System.out.println("Test ID from request: " + request.getTestId());
        System.out.println("Test Code: " + request.getTestCode());
        System.out.println("Test Name: " + request.getTestName());

        if (request.getParameters() == null) {
            System.out.println("Parameters: NULL");
        } else {
            System.out.println("Parameter count: " + request.getParameters().size());

            for (SosTestParameter p : request.getParameters()) {
                System.out.println(
                    "Parameter -> paramId=" + p.getParamId()
                    + ", testId=" + p.getTestId()
                    + ", method=" + p.getMethod()
                    + ", limits=" + p.getLimits()
                    + ", specification=" + p.getSpecification()
                );
            }
        }

        // Update Test Master
        SosTestMaster entity = new SosTestMaster();

        entity.setTestCode(request.getTestCode());
        entity.setTestName(request.getTestName());
        entity.setTestId(id);

        SosTestMaster updatedMaster = service.update(id, entity);

        System.out.println("Updated Master Test ID: "
                + updatedMaster.getTestId());

        // Update / Insert Parameters
        if (request.getParameters() != null) {
        	
        	List<SosTestParameter> existingParameters =
                    parameterService.getByTestId(id);

            // Get parameter IDs received from UI
            List<Long> requestParameterIds =
                    request.getParameters()
                            .stream()
                            .map(SosTestParameter::getParamId)
                            .filter(Objects::nonNull)
                            .collect(Collectors.toList());
            
            for (SosTestParameter existing : existingParameters) {

                if (!requestParameterIds.contains(existing.getParamId())) {

                    System.out.println(
                            "SOFT DELETE parameter: "
                            + existing.getParamId()
                    );

                    parameterService.delete(
                            existing.getParamId()
                    );
                }
            }


            for (SosTestParameter parameter : request.getParameters()) {

                parameter.setTestId(id);

                if (parameter.getParamId() != null) {

                    System.out.println(
                        "UPDATING parameter: "
                        + parameter.getParamId()
                    );

                    parameterService.getById(parameter.getParamId())
                            .ifPresent(existing -> {

                                existing.setTestId(updatedMaster.getTestId());
                                existing.setMethod(parameter.getMethod());
                                existing.setLimits(parameter.getLimits());
                                existing.setSpecification(parameter.getSpecification());

                                parameterService.save(existing);
                            });

                } else {

                    System.out.println(
                        "INSERTING NEW parameter for testId: "
                        + updatedMaster.getTestId()
                    );

                    parameterService.save(parameter);
                }
            }
        }

        System.out.println("========== UPDATE COMPLETE ==========");

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Test master updated successfully",
                        updatedMaster));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SosTestMasterRequest>> getById(
            @PathVariable Long id) {

        SosTestMaster master = service.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Test master not found"));

        List<SosTestParameter> parameters =
                parameterService.getByTestId(master.getTestId());

        SosTestMasterRequest response = new SosTestMasterRequest();

        response.setTestId(master.getTestId());
        response.setTestCode(master.getTestCode());
        response.setTestName(master.getTestName());
        response.setParameters(parameters);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Test master fetched successfully",
                        response));
    }

    // Get all active - no pagination
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<SosTestMaster>>> getAllActive() {
        return ResponseEntity.ok(
                ApiResponse.success("Active test masters fetched successfully",
                        service.findAllActive()));
    }

    // Get all active - paginated
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<SosTestMaster>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "testId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(
                ApiResponse.success("Test masters fetched successfully",
                        service.findAllActivePaginated(
                                page, size, sortBy, sortDir)));
    }

    // Search with pagination
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<SosTestMaster>>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "testId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(
                ApiResponse.success("Search results fetched successfully",
                        service.search(keyword, page, size, sortBy, sortDir)));
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(
                ApiResponse.success("Test master deleted successfully", null));
    }
    
}