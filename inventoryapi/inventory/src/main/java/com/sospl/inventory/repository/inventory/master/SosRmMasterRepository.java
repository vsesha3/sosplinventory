package com.sospl.inventory.repository.inventory.master;

import com.sospl.inventory.dto.inventory.master.SosRmMasterResponse;
import com.sospl.inventory.model.inventory.master.SosRmMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosRmMasterRepository extends JpaRepository<SosRmMaster, Integer> {

    List<SosRmMaster> findAllByIsDeletedFalse();

    List<SosRmMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosRmMaster> findByRmIdAndIsDeletedFalse(Integer rmId);

    Boolean existsByRmId(Integer rmId);

    Boolean existsByRmNameIgnoreCaseAndIsDeletedFalse(String rmName);

    List<SosRmMaster> findByRmNameContainingIgnoreCaseAndIsDeletedFalse(String keyword);

    // Get all with details - no pagination
    @Query("""
           SELECT new com.sospl.inventory.dto.inventory.master.SosRmMasterResponse(
                r.rmId,
                r.rmCode,
                r.rmName,
                u.uomName,
                g.rmGroupName,
                t.testName,
                r.avgRate
           )
           FROM SosRmMaster r
           LEFT JOIN SosUomMaster u ON r.uomId = u.uomId
           LEFT JOIN SosRmGroupMaster g ON r.rmGroupId = g.rmGroupId
           LEFT JOIN SosTestMaster t ON r.testId = t.testId
           """)
    List<SosRmMasterResponse> findAllWithDetails();

    // Get all with details - with pagination
    @Query("""
           SELECT new com.sospl.inventory.dto.inventory.master.SosRmMasterResponse(
                r.rmId,
                r.rmCode,
                r.rmName,
                u.uomName,
                g.rmGroupName,
                t.testName,
                r.avgRate
           )
           FROM SosRmMaster r
           LEFT JOIN SosUomMaster u ON r.uomId = u.uomId
           LEFT JOIN SosRmGroupMaster g ON r.rmGroupId = g.rmGroupId
           LEFT JOIN SosTestMaster t ON r.testId = t.testId
           """)
    Page<SosRmMasterResponse> findAllWithDetailsPaginated(Pageable pageable);

    // Search with pagination
    @Query("""
           SELECT new com.sospl.inventory.dto.inventory.master.SosRmMasterResponse(
                r.rmId,
                r.rmCode,
                r.rmName,
                u.uomName,
                g.rmGroupName,
                t.testName,
                r.avgRate
           )
           FROM SosRmMaster r
           LEFT JOIN SosUomMaster u ON r.uomId = u.uomId
           LEFT JOIN SosRmGroupMaster g ON r.rmGroupId = g.rmGroupId
           LEFT JOIN SosTestMaster t ON r.testId = t.testId
           WHERE LOWER(r.rmName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(u.uomName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(g.rmGroupName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           """)
    Page<SosRmMasterResponse> searchWithDetailsPaginated(
            @Param("keyword") String keyword, Pageable pageable);
}