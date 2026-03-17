package com.sospl.inventory.repository.inventory.view;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.sospl.inventory.model.inventory.SosPoHeader;

@Repository
public interface SosPoHeaderRepository
        extends JpaRepository<SosPoHeader, Long> {

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
}