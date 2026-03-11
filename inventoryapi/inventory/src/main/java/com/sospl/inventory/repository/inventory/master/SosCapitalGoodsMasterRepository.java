package com.sospl.inventory.repository.inventory.master;

import com.sospl.inventory.dto.inventory.master.SosCapitalGoodsMasterResponse;
import com.sospl.inventory.model.inventory.master.SosCapitalGoodsMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosCapitalGoodsMasterRepository
        extends JpaRepository<SosCapitalGoodsMaster, Long> {

    List<SosCapitalGoodsMaster> findAllByIsDeletedFalse();

    List<SosCapitalGoodsMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosCapitalGoodsMaster> findByCgIdAndIsDeletedFalse(Long cgId);

    Boolean existsByCgId(Long cgId);

    Boolean existsByCgNameIgnoreCaseAndIsDeletedFalse(String cgName);

    List<SosCapitalGoodsMaster> findByCgNameContainingIgnoreCaseAndIsDeletedFalse(
            String keyword);

    // Get all with uomName - no pagination
    @Query("""
           SELECT new com.sospl.inventory.dto.inventory.master.SosCapitalGoodsMasterResponse(
               cg.cgId,
               cg.cgCode,
               cg.cgName,
               cg.uomId,
               CASE WHEN u.uomName IS NULL THEN '-' ELSE u.uomName END,
               cg.avgRate,
               cg.isActive
           )
           FROM SosCapitalGoodsMaster cg
           LEFT JOIN SosUomMaster u ON cg.uomId = u.uomId
           WHERE cg.isActive = true AND cg.isDeleted = false
           """)
    List<SosCapitalGoodsMasterResponse> findAllWithDetails();

    // Get all with uomName - paginated
    @Query("""
           SELECT new com.sospl.inventory.dto.inventory.master.SosCapitalGoodsMasterResponse(
               cg.cgId,
               cg.cgCode,
               cg.cgName,
               cg.uomId,
               CASE WHEN u.uomName IS NULL THEN '-' ELSE u.uomName END,
               cg.avgRate,
               cg.isActive
           )
           FROM SosCapitalGoodsMaster cg
           LEFT JOIN SosUomMaster u ON cg.uomId = u.uomId
           WHERE cg.isActive = true AND cg.isDeleted = false
           """)
    Page<SosCapitalGoodsMasterResponse> findAllWithDetailsPaginated(Pageable pageable);

    // Search with uomName - paginated
    @Query("""
           SELECT new com.sospl.inventory.dto.inventory.master.SosCapitalGoodsMasterResponse(
               cg.cgId,
               cg.cgCode,
               cg.cgName,
               cg.uomId,
               CASE WHEN u.uomName IS NULL THEN '-' ELSE u.uomName END,
               cg.avgRate,
               cg.isActive
           )
           FROM SosCapitalGoodsMaster cg
           LEFT JOIN SosUomMaster u ON cg.uomId = u.uomId
           WHERE (cg.isActive = true AND cg.isDeleted = false)
           AND (
               LOWER(cg.cgName) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(cg.cgCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(u.uomName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           )
           """)
    Page<SosCapitalGoodsMasterResponse> searchWithDetailsPaginated(
            @Param("keyword") String keyword, Pageable pageable);
}