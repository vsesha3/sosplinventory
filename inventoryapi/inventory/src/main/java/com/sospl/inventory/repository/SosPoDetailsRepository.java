package com.sospl.inventory.repository;




import com.sospl.inventory.model.SosPoDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SosPoDetailsRepository extends JpaRepository<SosPoDetails, Long> {

    // Fetch all active line items for a given PO
    List<SosPoDetails> findByPoRefNoAndIsActiveTrue(Long poRefNo);

    // Soft delete all line items for a PO (used before re-saving updated list)
    @Modifying
    @Query("UPDATE SosPoDetails d SET d.isActive = false WHERE d.poRefNo = :poRefNo")
    void deactivateByPoRefNo(@Param("poRefNo") Long poRefNo);
}