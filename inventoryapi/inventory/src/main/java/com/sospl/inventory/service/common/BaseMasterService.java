package com.sospl.inventory.service.common;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface BaseMasterService<T, ID> {

    // Create
    T save(T entity);

    // Update (fix for update(Long, entity) error)
    T update(ID id, T entity);

    // Read by ID
    Optional<T> findById(ID id);

    // Read all (non-paginated)
    List<T> findAll();

    // Read all (paginated) — fix for Pageable error
    Page<T> findAll(Pageable pageable);

    // Delete
    void delete(ID id);

    // Exists
    boolean existsById(ID id);
}