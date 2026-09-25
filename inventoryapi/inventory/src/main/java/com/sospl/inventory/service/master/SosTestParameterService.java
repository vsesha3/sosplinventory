package com.sospl.inventory.service.master;

import com.sospl.inventory.model.master.SosTestParameter;
import com.sospl.inventory.repository.master.SosTestParameterRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SosTestParameterService {

    private final SosTestParameterRepository repository;

    public SosTestParameterService(SosTestParameterRepository repository) {
        this.repository = repository;
    }

    public List<SosTestParameter> getAll() {
        return repository.findAll();
    }

    public Optional<SosTestParameter> getById(Long paramId) {
        return repository.findById(paramId);
    }

    public List<SosTestParameter> getByTestId(Long testId) {
        return repository.findByTestId(testId);
    }

    public List<SosTestParameter> getActiveByTestId(Long testId) {
        return repository.findByTestIdAndIsActiveTrueAndIsDeletedFalse(testId);
    }

    public SosTestParameter save(SosTestParameter parameter) {
        return repository.save(parameter);
    }

    public void delete(Long paramId) {
        repository.deleteById(paramId);
    }
}