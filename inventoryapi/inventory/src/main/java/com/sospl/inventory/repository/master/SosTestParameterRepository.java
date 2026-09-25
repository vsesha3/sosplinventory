package com.sospl.inventory.repository.master;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sospl.inventory.model.master.SosTestParameter;

import java.util.List;

@Repository
public interface SosTestParameterRepository
        extends JpaRepository<SosTestParameter, Long> {

    List<SosTestParameter> findByTestId(Long testId);

    List<SosTestParameter> findByTestIdAndIsActiveTrueAndIsDeletedFalse(Long testId);
}