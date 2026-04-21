// File 2 — SosRmRequestDetlsRepository.java
package com.sospl.inventory.repository.rmrequest;

import com.sospl.inventory.model.rmrequest.SosRmRequestDetls;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SosRmRequestDetlsRepository
        extends JpaRepository<SosRmRequestDetls, Long> {

    // Find by rm_req_id — get all lines for a request
    List<SosRmRequestDetls> findAllByRmReqIdAndIsDeletedFalse(
            Long rmReqId);

    // Find by rm_id
    List<SosRmRequestDetls> findAllByRmIdAndIsDeletedFalse(Long rmId);

    // Find all active
    List<SosRmRequestDetls> findAllByIsActiveTrueAndIsDeletedFalse();
}