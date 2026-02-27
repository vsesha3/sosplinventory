package com.sospl.inventory.service.inventory.master;

import com.sospl.inventory.dto.inventory.master.SosProductGroupMasterRequest;
import com.sospl.inventory.dto.inventory.master.SosProductGroupMasterResponse;

import java.util.List;

public interface SosProductGroupMasterService {

    // Create
    SosProductGroupMasterResponse create(
            SosProductGroupMasterRequest request,
            String createdBy);

    // Get by id
    SosProductGroupMasterResponse getById(Long id);

    // Get by product group id
    SosProductGroupMasterResponse getByProductGroupId(Integer productGroupId);

    // Get all
    List<SosProductGroupMasterResponse> getAll();

    // Get all active
    List<SosProductGroupMasterResponse> getAllActive();

    // Get by ch head no
    List<SosProductGroupMasterResponse> getByChHeadNo(Integer chHeadNo);

    // Search by group name
    List<SosProductGroupMasterResponse> search(String keyword);

    // Update
    SosProductGroupMasterResponse update(
            Long id,
            SosProductGroupMasterRequest request,
            String updatedBy);

    // Activate
    void activate(Long id, String updatedBy);

    // Deactivate
    void deactivate(Long id, String updatedBy);

    // Delete
    void delete(Long id, String deletedBy);
}