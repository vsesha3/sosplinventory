package com.sospl.inventory.repository;

import com.sospl.inventory.model.SosFgLotAutoIncrement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SosFgLotAutoIncrementRepository
        extends JpaRepository<SosFgLotAutoIncrement, Long> {

    @Query(value = """
           SELECT *
           FROM sos_fg_lot_auto_increment_t
           WHERE UPPER(product_fg_lot_code) = UPPER(:productFgLotCode)
           AND year = :year
           """, nativeQuery = true)
    Optional<SosFgLotAutoIncrement> findByProductFgLotCodeAndYear(
            @Param("productFgLotCode") String productFgLotCode,
            @Param("year") String year);
}