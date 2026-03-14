package com.sospl.inventory.repository.inventory.master.view;



import com.sospl.inventory.model.inventory.master.view.SosSupplierMasterView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosSupplierMasterViewRepository
        extends JpaRepository<SosSupplierMasterView, Long> {

    // Find all active
    List<SosSupplierMasterView> findAllByIsActiveTrue();

    // Find by supplier id
    Optional<SosSupplierMasterView> findBySupplierId(Long supplierId);

    // Find by supplier code
    Optional<SosSupplierMasterView> findBySupplierCode(String supplierCode);

    // Find all active paginated
    Page<SosSupplierMasterView> findAllByIsActiveTrue(Pageable pageable);

    // Search paginated
    @Query("""
           SELECT s FROM SosSupplierMasterView s
           WHERE LOWER(s.supplierName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(s.supplierCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(s.countryName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(s.supplierTypeName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(s.phoneNo) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(s.eMailId) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(s.contactPerson) LIKE LOWER(CONCAT('%', :keyword, '%'))
           """)
    Page<SosSupplierMasterView> searchPaginated(
            @Param("keyword") String keyword, Pageable pageable);

    // Search active only paginated
    @Query("""
           SELECT s FROM SosSupplierMasterView s
           WHERE s.isActive = true
           AND (
               LOWER(s.supplierName) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(s.supplierCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(s.countryName) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(s.supplierTypeName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           )
           """)
    Page<SosSupplierMasterView> searchActivePaginated(
            @Param("keyword") String keyword, Pageable pageable);
    
    
 // Add this method to existing repository
    @Query("""
           SELECT s FROM SosSupplierMasterView s
           WHERE s.isActive = true
           ORDER BY s.supplierName ASC
           """)
    List<SosSupplierMasterView> findAllForDropDown();
}
