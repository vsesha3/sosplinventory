package com.sospl.inventory.repository.inventory.master;

import com.sospl.inventory.dto.inventory.master.SosRmMasterNativeResponse;
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

    // ── Find all with details — no pagination ─────────────────────────────
    @Query(value = """
           SELECT
               r.rm_id          AS rmId,
               r.rm_code        AS rmCode,
               r.rm_name        AS rmName,
               u.uom_name       AS uomName,
               g.rm_group_name  AS rmGroupName,
               t.test_name      AS testName,
               r.avg_rate       AS avgRate,
               r.rm_group_id    AS rmGroupId,
               r.material_type  AS materialType
           FROM sos_rm_master_t r
           LEFT JOIN sos_uom_master_t u
               ON r.uom_id = u.uom_id
           LEFT JOIN sos_rm_group_master_t g
               ON r.rm_group_id = g.rm_group_id
           LEFT JOIN sos_test_master_t t
               ON r.test_id = t.test_id
           WHERE r.is_deleted = 0
           ORDER BY r.rm_name ASC
           """, nativeQuery = true)
    List<Object[]> findAllWithDetails();

    // ── Find all with details — paginated ─────────────────────────────────
    @Query(value = """
           SELECT
               r.rm_id          AS rmId,
               r.rm_code        AS rmCode,
               r.rm_name        AS rmName,
               u.uom_name       AS uomName,
               g.rm_group_name  AS rmGroupName,
               t.test_name      AS testName,
               r.avg_rate       AS avgRate,
               r.rm_group_id    AS rmGroupId,
               r.material_type  AS materialType
           FROM sos_rm_master_t r
           LEFT JOIN sos_uom_master_t u
               ON r.uom_id = u.uom_id
           LEFT JOIN sos_rm_group_master_t g
               ON r.rm_group_id = g.id 
           LEFT JOIN sos_test_master_t t
               ON r.test_id = t.test_id
           WHERE r.is_deleted = 0
           ORDER BY r.rm_name ASC
           """,
           countQuery = """
           SELECT COUNT(*)
           FROM sos_rm_master_t r
           WHERE r.is_deleted = 0
           """,
           nativeQuery = true)
    Page<Object[]> findAllWithDetailsPaginated(Pageable pageable);

    // ── Search with pagination ────────────────────────────────────────────
    @Query(value = """
           SELECT
               r.rm_id          AS rmId,
               r.rm_code        AS rmCode,
               r.rm_name        AS rmName,
               u.uom_name       AS uomName,
               g.rm_group_name  AS rmGroupName,
               t.test_name      AS testName,
               r.avg_rate       AS avgRate,
               r.rm_group_id    AS rmGroupId,
               r.material_type  AS materialType
           FROM sos_rm_master_t r
           LEFT JOIN sos_uom_master_t u
               ON r.uom_id = u.uom_id
           LEFT JOIN sos_rm_group_master_t g
               ON r.rm_group_id = g.rm_group_id
           LEFT JOIN sos_test_master_t t
               ON r.test_id = t.test_id
           WHERE r.is_deleted = 0
           AND (
               LOWER(r.rm_name)       LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR CAST(r.rm_code AS CHAR) LIKE CONCAT('%', :keyword, '%')
               OR LOWER(u.uom_name)   LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(g.rm_group_name) LIKE LOWER(CONCAT('%', :keyword, '%'))
           )
           ORDER BY r.rm_name ASC
           """,
           countQuery = """
           SELECT COUNT(*)
           FROM sos_rm_master_t r
           LEFT JOIN sos_uom_master_t u
               ON r.uom_id = u.uom_id
           LEFT JOIN sos_rm_group_master_t g
               ON r.rm_group_id = g.rm_group_id
           WHERE r.is_deleted = 0
           AND (
               LOWER(r.rm_name)       LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR CAST(r.rm_code AS CHAR) LIKE CONCAT('%', :keyword, '%')
               OR LOWER(u.uom_name)   LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(g.rm_group_name) LIKE LOWER(CONCAT('%', :keyword, '%'))
           )
           """,
           nativeQuery = true)
    Page<Object[]> searchWithDetailsPaginated(
            @Param("keyword") String keyword,
            Pageable pageable);

    // ── Active with pack details ───────────────────────────────────────────
    @Query(value = """
           SELECT
               r.rm_id                    AS rmId,
               r.rm_code                  AS rmCode,
               r.rm_name                  AS rmName,
               r.uom_id                   AS uomId,
               COALESCE(u.uom_name, '-')  AS uomName,
               r.pack_uom                 AS packUom,
               COALESCE(p.uom_name, '-')  AS packUomName,
               r.avg_rate                 AS avgRate,
               r.pack_size                AS packSize
           FROM sos_rm_master_t r
           LEFT JOIN sos_uom_master_t u ON r.uom_id = u.uom_id
           LEFT JOIN sos_uom_master_t p ON r.pack_uom = p.uom_id
           WHERE r.is_active = 1 AND r.is_deleted = 0
           ORDER BY r.rm_name ASC
           """, nativeQuery = true)
    List<SosRmMasterNativeResponse> findAllActiveWithDetails();

    @Query(value = """
           SELECT
               r.rm_id                    AS rmId,
               r.rm_code                  AS rmCode,
               r.rm_name                  AS rmName,
               r.uom_id                   AS uomId,
               COALESCE(u.uom_name, '-')  AS uomName,
               r.pack_uom                 AS packUom,
               COALESCE(p.uom_name, '-')  AS packUomName,
               r.avg_rate                 AS avgRate,
               r.pack_size                AS packSize
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
               r.rm_id                    AS rmId,
               r.rm_code                  AS rmCode,
               r.rm_name                  AS rmName,
               r.uom_id                   AS uomId,
               COALESCE(u.uom_name, '-')  AS uomName,
               r.pack_uom                 AS packUom,
               COALESCE(p.uom_name, '-')  AS packUomName,
               r.avg_rate                 AS avgRate,
               r.pack_size                AS packSize
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

    @Query(value = """
           SELECT COALESCE(MAX(rm_code), 1000000000) + 1
           FROM sos_rm_master_t
           """, nativeQuery = true)
    Integer getNextRmCode();
}