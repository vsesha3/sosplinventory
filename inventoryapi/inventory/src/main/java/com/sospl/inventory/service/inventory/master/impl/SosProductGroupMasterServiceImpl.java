
package com.sospl.inventory.service.inventory.master.impl;

import com.sospl.inventory.dto.inventory.master.SosProductGroupMasterRequest;
import com.sospl.inventory.dto.inventory.master.SosProductGroupMasterResponse;
import com.sospl.inventory.model.inventory.master.SosProductGroupMaster;
import com.sospl.inventory.repository.inventory.master.SosProductGroupMasterRepository;
import com.sospl.inventory.service.inventory.master.SosProductGroupMasterService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class SosProductGroupMasterServiceImpl
        implements SosProductGroupMasterService {

    @Autowired
    private SosProductGroupMasterRepository repository;

    @Override
    public SosProductGroupMasterResponse create(
            SosProductGroupMasterRequest request,
            String createdBy) {

        // Check if product group id already exists
        if (repository.existsByProductGroupId(request.getProductGroupId())) {
            throw new RuntimeException("Product group ID already exists");
        }

        // Check if group name already exists
        if (repository.existsByGroupName(request.getGroupName())) {
            throw new RuntimeException("Group name already exists");
        }

        SosProductGroupMaster entity = new SosProductGroupMaster();
        entity.setProductGroupId(request.getProductGroupId());
        entity.setGroupName(request.getGroupName());
        entity.setChHeadNo(request.getChHeadNo());
        entity.setIsActive(true);
        entity.setIsDeleted(false);
        entity.setCreatedBy(createdBy);
        repository.save(entity);

        return mapToResponse(entity);
    }

    @Override
    public SosProductGroupMasterResponse getById(Long id) {
        SosProductGroupMaster entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Product group not found"));
        return mapToResponse(entity);
    }

    @Override
    public SosProductGroupMasterResponse getByProductGroupId(
            Integer productGroupId) {
        SosProductGroupMaster entity = repository
                .findByProductGroupId(productGroupId)
                .orElseThrow(() -> new RuntimeException(
                        "Product group not found"));
        return mapToResponse(entity);
    }

    @Override
    public List<SosProductGroupMasterResponse> getAll() {
        List<SosProductGroupMasterResponse> responses = new ArrayList<>();
        repository.findAllByIsDeletedFalse()
                .forEach(entity -> responses.add(mapToResponse(entity)));
        return responses;
    }

    @Override
    public List<SosProductGroupMasterResponse> getAllActive() {
        List<SosProductGroupMasterResponse> responses = new ArrayList<>();
        repository.findAllByIsActiveTrueAndIsDeletedFalse()
                .forEach(entity -> responses.add(mapToResponse(entity)));
        return responses;
    }

    @Override
    public List<SosProductGroupMasterResponse> getByChHeadNo(
            Integer chHeadNo) {
        List<SosProductGroupMasterResponse> responses = new ArrayList<>();
        repository.findAllByChHeadNo(chHeadNo)
                .forEach(entity -> responses.add(mapToResponse(entity)));
        return responses;
    }

    @Override
    public List<SosProductGroupMasterResponse> search(String keyword) {
        List<SosProductGroupMasterResponse> responses = new ArrayList<>();
        repository.searchByGroupName(keyword)
                .forEach(entity -> responses.add(mapToResponse(entity)));
        return responses;
    }

    @Override
    public SosProductGroupMasterResponse update(
            Long id,
            SosProductGroupMasterRequest request,
            String updatedBy) {

        SosProductGroupMaster entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Product group not found"));

        entity.setGroupName(request.getGroupName());
        entity.setChHeadNo(request.getChHeadNo());
        entity.setUpdatedBy(updatedBy);
        entity.setUpdatedAt(LocalDateTime.now());
        repository.save(entity);

        return mapToResponse(entity);
    }

    @Override
    public void activate(Long id, String updatedBy) {
        SosProductGroupMaster entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Product group not found"));
        entity.setIsActive(true);
        entity.setUpdatedBy(updatedBy);
        entity.setUpdatedAt(LocalDateTime.now());
        repository.save(entity);
    }

    @Override
    public void deactivate(Long id, String updatedBy) {
        SosProductGroupMaster entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Product group not found"));
        entity.setIsActive(false);
        entity.setUpdatedBy(updatedBy);
        entity.setUpdatedAt(LocalDateTime.now());
        repository.save(entity);
    }

    @Override
    public void delete(Long id, String deletedBy) {
        SosProductGroupMaster entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Product group not found"));
        entity.setIsDeleted(true);
        entity.setIsActive(false);
        entity.setDeletedBy(deletedBy);
        entity.setDeletedAt(LocalDateTime.now());
        repository.save(entity);
    }

    // Helper mapper
    private SosProductGroupMasterResponse mapToResponse(
            SosProductGroupMaster entity) {
        SosProductGroupMasterResponse response =
                new SosProductGroupMasterResponse();
        response.setId(entity.getId());
        response.setProductGroupId(entity.getProductGroupId());
        response.setGroupName(entity.getGroupName());
        response.setChHeadNo(entity.getChHeadNo());
        response.setIsActive(entity.getIsActive());
        response.setCreatedBy(entity.getCreatedBy());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedBy(entity.getUpdatedBy());
        response.setUpdatedAt(entity.getUpdatedAt());
        return response;
    }
}