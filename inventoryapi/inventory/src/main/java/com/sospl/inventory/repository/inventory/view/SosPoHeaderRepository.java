package com.sospl.inventory.repository.inventory.view;

import com.sospl.inventory.model.SosPoHeader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SosPoHeaderRepository
        extends JpaRepository<SosPoHeader, Long> {

    // Check duplicate PO number
    boolean existsByPoNo(String poNo);

    // Check duplicate PO number excluding current record for update
    boolean existsByPoNoAndPoRefNoNot(String poNo, Long poRefNo);

    // Validate supplier is active
    @Query(value = """
           SELECT COUNT(*) > 0
           FROM sos_supplier_master_t
           WHERE supplier_id = :supplierId
           AND is_active = 1
           """, nativeQuery = true)
    boolean isSupplierActive(@Param("supplierId") Long supplierId);

    // Get next running number
    @Query(value = """
           SELECT COALESCE(MAX(
               CAST(
                   SUBSTRING_INDEX(
                       SUBSTRING_INDEX(po_no, '/', 2),
                       '/', -1
                   ) AS UNSIGNED
               )
           ), 0) + 1
           FROM sos_po_header_t
           WHERE po_no LIKE CONCAT(:prefix, '/%/%')
           AND po_no LIKE CONCAT('%/', :financialYear)
           """, nativeQuery = true)
    Integer getNextRunningNumber(
            @Param("prefix") String prefix,
            @Param("financialYear") String financialYear);

    Optional<SosPoHeader> findByPoRefNo(Long poRefNo);
    

    // Get next po_ref_no — max existing + 1
    @Query(value = """
           SELECT COALESCE(MAX(po_ref_no), 0) + 1
           FROM sos_po_header_t
           """, nativeQuery = true)
    Long getNextPoRefNo();

    
    
}