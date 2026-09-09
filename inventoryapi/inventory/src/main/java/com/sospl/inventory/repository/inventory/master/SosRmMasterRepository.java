package com.sospl.inventory.repository.inventory.master;

import com.sospl.inventory.dto.inventory.master.SosRmMasterNativeResponse;
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
public interface SosRmMasterRepository
        extends JpaRepository<SosRmMaster, Integer> {

    List<SosRmMaster> findAllByIsDeletedFalse();

    List<SosRmMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosRmMaster> findByRmIdAndIsDeletedFalse(Integer rmId);
    Optional<SosRmMaster> findByRmCodeAndIsDeletedFalse(Integer rmCode);

    Boolean existsByRmId(Integer rmId);

    Boolean existsByRmNameIgnoreCaseAndIsDeletedFalse(String rmName);

    List<SosRmMaster> findByRmNameContainingIgnoreCaseAndIsDeletedFalse(
            String keyword);

    // ── Existing queries — DO NOT CHANGE ─────────────────────────────────

    @Query("""
           SELECT new com.sospl.inventory.dto.inventory.master.SosRmMasterResponse(
                r.rmId,
                r.rmCode,
                r.rmName,
               
                u.uomName,
                g.rmGroupName,
                t.testName,
                r.avgRate,
                 r.rmGroupId
           )
           FROM SosRmMaster r
           LEFT JOIN SosUomMaster u ON r.uomId = u.uomId
           LEFT JOIN SosRmGroupMaster g ON r.rmGroupId = g.rmGroupId
           LEFT JOIN SosTestMaster t ON r.testId = t.testId
           """)
    List<SosRmMasterResponse> findAllWithDetails();

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

    // ── New queries — native SQL + projection interface ───────────────────

    @Query(value = """
           SELECT
               r.rm_id                           AS rmId,
               r.rm_code                         AS rmCode,
               r.rm_name                         AS rmName,
               r.uom_id                          AS uomId,
               COALESCE(u.uom_name, '-')          AS uomName,
               r.pack_uom                        AS packUom,
               COALESCE(p.uom_name, '-')          AS packUomName,
               r.avg_rate                        AS avgRate,
               r.pack_size                       AS packSize
           FROM sos_rm_master_t r
           LEFT JOIN sos_uom_master_t u ON r.uom_id = u.uom_id
           LEFT JOIN sos_uom_master_t p ON r.pack_uom = p.uom_id
           WHERE r.is_active = 1 AND r.is_deleted = 0
           ORDER BY r.rm_name ASC
           """, nativeQuery = true)
    List<SosRmMasterNativeResponse> findAllActiveWithDetails();

    @Query(value = """
           SELECT
               r.rm_id                           AS rmId,
               r.rm_code                         AS rmCode,
               r.rm_name                         AS rmName,
               r.uom_id                          AS uomId,
               COALESCE(u.uom_name, '-')          AS uomName,
               r.pack_uom                        AS packUom,
               COALESCE(p.uom_name, '-')          AS packUomName,
               r.avg_rate                        AS avgRate,
               r.pack_size                       AS packSize
           FROM sos_rm_master_t r
           LEFT JOIN sos_uom_master_t u ON r.uom_id = u.uom_id
           LEFT JOIN sos_uom_master_t p ON r.pack_uom = p.uom_id
           WHERE r.is_active = 1 AND r.is_deleted = 0
           """,
           countQuery = """
           SELECT COUNT(*)
           FROM sos_rm_master_t r
           WHERE r.is_active = 1 AND r.is_deleted = 0
           """, nativeQuery = true)
    Page<SosRmMasterNativeResponse> findAllActiveWithDetailsPaginated(
            Pageable pageable);

    @Query(value = """
           SELECT
               r.rm_id                           AS rmId,
               r.rm_code                         AS rmCode,
               r.rm_name                         AS rmName,
               r.uom_id                          AS uomId,
               COALESCE(u.uom_name, '-')          AS uomName,
               r.pack_uom                        AS packUom,
               COALESCE(p.uom_name, '-')          AS packUomName,
               r.avg_rate                        AS avgRate,
               r.pack_size                       AS packSize
           FROM sos_rm_master_t r
           LEFT JOIN sos_uom_master_t u ON r.uom_id = u.uom_id
           LEFT JOIN sos_uom_master_t p ON r.pack_uom = p.uom_id
           WHERE r.is_active = 1 AND r.is_deleted = 0
           AND (
               LOWER(r.rm_name) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR CAST(r.rm_code AS CHAR) LIKE CONCAT('%', :keyword, '%')
               OR LOWER(u.uom_name) LIKE LOWER(CONCAT('%', :keyword, '%'))
           )
           """,
           countQuery = """
           SELECT COUNT(*)
           FROM sos_rm_master_t r
           LEFT JOIN sos_uom_master_t u ON r.uom_id = u.uom_id
           WHERE r.is_active = 1 AND r.is_deleted = 0
           AND (
               LOWER(r.rm_name) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR CAST(r.rm_code AS CHAR) LIKE CONCAT('%', :keyword, '%')
               OR LOWER(u.uom_name) LIKE LOWER(CONCAT('%', :keyword, '%'))
           )
           """, nativeQuery = true)
    Page<SosRmMasterNativeResponse> searchActiveWithDetailsPaginated(
            @Param("keyword") String keyword, Pageable pageable);

	
}

