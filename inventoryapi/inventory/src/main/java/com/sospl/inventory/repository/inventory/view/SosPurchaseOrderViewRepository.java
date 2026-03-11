package com.sospl.inventory.repository.inventory.view;

import com.sospl.inventory.model.inventory.view.SosPurchaseOrderView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface SosPurchaseOrderViewRepository
        extends JpaRepository<SosPurchaseOrderView, Long> {

    Optional<SosPurchaseOrderView> findByPoRefNo(Long poRefNo);

    @Query("""
           SELECT p FROM SosPurchaseOrderView p
           ORDER BY p.poDate DESC
           """)
    Page<SosPurchaseOrderView> findAllPaginated(Pageable pageable);

    @Query("""
           SELECT p FROM SosPurchaseOrderView p
           WHERE p.supplierId = :supplierId
           ORDER BY p.poDate DESC
           """)
    Page<SosPurchaseOrderView> findBySupplierId(
            @Param("supplierId") Long supplierId,
            Pageable pageable);

    @Query("""
           SELECT p FROM SosPurchaseOrderView p
           WHERE p.poDate BETWEEN :fromDate AND :toDate
           ORDER BY p.poDate DESC
           """)
    Page<SosPurchaseOrderView> findByDateRange(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable);

    @Query("""
           SELECT p FROM SosPurchaseOrderView p
           WHERE p.supplierId = :supplierId
           AND p.poDate BETWEEN :fromDate AND :toDate
           ORDER BY p.poDate DESC
           """)
    Page<SosPurchaseOrderView> findBySupplierIdAndDateRange(
            @Param("supplierId") Long supplierId,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable);

    @Query("""
           SELECT p FROM SosPurchaseOrderView p
           WHERE LOWER(p.poNo) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(p.supplierName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(p.supplierCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(p.poType) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(p.poReference) LIKE LOWER(CONCAT('%', :keyword, '%'))
           ORDER BY p.poDate DESC
           """)
    Page<SosPurchaseOrderView> searchPaginated(
            @Param("keyword") String keyword,
            Pageable pageable);
}