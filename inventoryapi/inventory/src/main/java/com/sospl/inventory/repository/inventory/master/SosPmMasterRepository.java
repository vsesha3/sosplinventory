package com.sospl.inventory.repository.inventory.master;

import com.sospl.inventory.dto.inventory.master.SosPmMasterResponse;
import com.sospl.inventory.model.inventory.master.SosPmMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosPmMasterRepository extends JpaRepository<SosPmMaster, Long> {

    List<SosPmMaster> findAllByIsDeletedFalse();

    List<SosPmMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosPmMaster> findByPmIdAndIsDeletedFalse(Integer pmId);

    Boolean existsByPmId(Integer pmId);

    Boolean existsByPmNameIgnoreCaseAndIsDeletedFalse(String pmName);

    List<SosPmMaster> findByPmNameContainingIgnoreCaseAndIsDeletedFalse(
            String keyword);

    // Get all with details - no pagination
    @Query("""
           SELECT new com.sospl.inventory.dto.inventory.master.SosPmMasterResponse(
                p.pmId,
                p.pmCode,
                p.pmName,
                p.pmSize,
                p.fgLotCode,
                CASE WHEN g.pmGroupName IS NULL THEN '-' ELSE g.pmGroupName END,
                p.pmGroupId,
                p.avgRate,
                CASE WHEN u.uomName IS NULL THEN '-' ELSE u.uomName END
           )
           FROM SosPmMaster p
           LEFT JOIN SosPmGroupMaster g ON p.pmGroupId = g.pmGroupId
           LEFT JOIN SosUomMaster u ON p.uomId = u.uomId
           """)
    List<SosPmMasterResponse> findAllWithDetails();

    // Get all with details - paginated
    @Query("""
           SELECT new com.sospl.inventory.dto.inventory.master.SosPmMasterResponse(
                p.pmId,
                p.pmCode,
                p.pmName,
                p.pmSize,
                p.fgLotCode,
                CASE WHEN g.pmGroupName IS NULL THEN '-' ELSE g.pmGroupName END,
                p.pmGroupId,
                p.avgRate,
                CASE WHEN u.uomName IS NULL THEN '-' ELSE u.uomName END
           )
           FROM SosPmMaster p
           LEFT JOIN SosPmGroupMaster g ON p.pmGroupId = g.pmGroupId
           LEFT JOIN SosUomMaster u ON p.uomId = u.uomId
           """)
    Page<SosPmMasterResponse> findAllWithDetailsPaginated(Pageable pageable);

    // Search with pagination
    @Query("""
           SELECT new com.sospl.inventory.dto.inventory.master.SosPmMasterResponse(
                p.pmId,
                p.pmCode,
                p.pmName,
                p.pmSize,
                p.fgLotCode,
                CASE WHEN g.pmGroupName IS NULL THEN '-' ELSE g.pmGroupName END,
                p.pmGroupId,
                p.avgRate,
                CASE WHEN u.uomName IS NULL THEN '-' ELSE u.uomName END
           )
           FROM SosPmMaster p
           LEFT JOIN SosPmGroupMaster g ON p.pmGroupId = g.pmGroupId
           LEFT JOIN SosUomMaster u ON p.uomId = u.uomId
           WHERE LOWER(p.pmName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(g.pmGroupName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(u.uomName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           """)
    Page<SosPmMasterResponse> searchWithDetailsPaginated(
            @Param("keyword") String keyword, Pageable pageable);
    
    
    @Query(value = """
    	       SELECT fg_lot_code
    	       FROM sos_pm_master_t
    	       WHERE pm_id = :pmId
    	       """, nativeQuery = true)
    	String findFgLotCodeByPmId(@Param("pmId") Long pmId);
}