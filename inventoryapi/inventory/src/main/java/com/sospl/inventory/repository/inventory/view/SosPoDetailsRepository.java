package com.sospl.inventory.repository.inventory.view;

import com.sospl.inventory.model.inventory.SosPoDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SosPoDetailsRepository
        extends JpaRepository<SosPoDetails, Long> {

    // Get all details by po_ref_no
    @Query("""
           SELECT p FROM SosPoDetails p
           WHERE p.poRefNo = :poRefNo
           AND p.isActive = true
           ORDER BY p.poDetId ASC
           """)
    List<SosPoDetails> findByPoRefNo(
            @Param("poRefNo") Long poRefNo);
}