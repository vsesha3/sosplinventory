package com.sospl.inventory.repository.rmrequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sospl.inventory.model.rmrequest.SosRmRequestView;

@Repository
public interface SosRmRequestViewRepository
        extends JpaRepository<SosRmRequestView, Long> {

    Page<SosRmRequestView> findAllByOrderByRmReqIdDesc(Pageable pageable);

}