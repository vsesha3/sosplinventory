package com.sospl.inventory.service.common.impl;

import com.sospl.inventory.service.common.BaseMasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public abstract class BaseMasterServiceImpl<T, ID>
        implements BaseMasterService<T, ID> {

    protected final JpaRepository<T, ID> repository;

    protected BaseMasterServiceImpl(JpaRepository<T, ID> repository) {
        this.repository = repository;
    }

    // ===============================
    // CREATE
    // ===============================
    @Override
    public T save(T entity) {
        return repository.save(entity);
    }

    // ===============================
    // UPDATE (Fix #1)
    // ===============================
    @Override
    public T update(ID id, T entity) {

        if (!repository.existsById(id)) {
            throw new RuntimeException("Record not found with id: " + id);
        }

        return repository.save(entity);
    }

    // ===============================
    // READ
    // ===============================
    @Override
    public Optional<T> findById(ID id) {
        return repository.findById(id);
    }

    @Override
    public List<T> findAll() {
        return repository.findAll();
    }

    // ===============================
    // PAGINATION (Fix #2)
    // ===============================
    @Override
    public Page<T> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    // ===============================
    // DELETE
    // ===============================
    @Override
    public void delete(ID id) {
        repository.deleteById(id);
    }

    // ===============================
    // EXISTS
    // ===============================
    @Override
    public boolean existsById(ID id) {
        return repository.existsById(id);
    }
}