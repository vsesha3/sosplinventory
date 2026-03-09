package com.sospl.inventory.repository.inventory.master;

import com.sospl.inventory.dto.inventory.master.SosProductMasterResponse;
import com.sospl.inventory.model.inventory.master.SosProductMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosProductMasterRepository
        extends JpaRepository<SosProductMaster, Long> {

    List<SosProductMaster> findAllByIsDeletedFalse();

    List<SosProductMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosProductMaster> findByProductIdAndIsDeletedFalse(Integer productId);

    Boolean existsByProductId(Integer productId);

    Boolean existsByProductNameIgnoreCaseAndIsDeletedFalse(String productName);

    List<SosProductMaster> findByProductNameContainingIgnoreCaseAndIsDeletedFalse(
            String keyword);

    // Get all with details - no pagination
    @Query("""
           SELECT new com.sospl.inventory.dto.inventory.master.SosProductMasterResponse(
                p.productId,
                p.productCode,
                p.productName,
                u.uomName,
                p.productGroupId,
                t.testName,
                p.rate
           )
           FROM SosProductMaster p
           LEFT JOIN SosUomMaster u ON p.uomId = u.uomId
           LEFT JOIN SosTestMaster t ON p.testId = t.testId
           """)
    List<SosProductMasterResponse> findAllWithDetails();

    // Get all with details - paginated
    @Query("""
           SELECT new com.sospl.inventory.dto.inventory.master.SosProductMasterResponse(
                p.productId,
                p.productCode,
                p.productName,
                u.uomName,
                p.productGroupId,
                t.testName,
                p.rate
           )
           FROM SosProductMaster p
           LEFT JOIN SosUomMaster u ON p.uomId = u.uomId
           LEFT JOIN SosTestMaster t ON p.testId = t.testId
           """)
    Page<SosProductMasterResponse> findAllWithDetailsPaginated(Pageable pageable);

    // Search with pagination
    @Query("""
           SELECT new com.sospl.inventory.dto.inventory.master.SosProductMasterResponse(
                p.productId,
                p.productCode,
                p.productName,
                u.uomName,
                p.productGroupId,
                t.testName,
                p.rate
           )
           FROM SosProductMaster p
           LEFT JOIN SosUomMaster u ON p.uomId = u.uomId
           LEFT JOIN SosTestMaster t ON p.testId = t.testId
           WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(u.uomName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           """)
    Page<SosProductMasterResponse> searchWithDetailsPaginated(
            @Param("keyword") String keyword, Pageable pageable);
}