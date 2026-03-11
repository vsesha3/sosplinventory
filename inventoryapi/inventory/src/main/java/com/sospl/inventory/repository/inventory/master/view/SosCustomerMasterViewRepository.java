package com.sospl.inventory.repository.inventory.master.view;

import com.sospl.inventory.model.inventory.master.view.SosCustomerMasterView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SosCustomerMasterViewRepository
        extends JpaRepository<SosCustomerMasterView, Long> {

    Optional<SosCustomerMasterView> findByCustomerId(Long customerId);

    Page<SosCustomerMasterView> findAllByIsActiveTrue(Pageable pageable);

    @Query("""
           SELECT c FROM SosCustomerMasterView c
           WHERE LOWER(c.customerName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(c.customerCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(c.countryName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(c.location) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(c.phoneNo) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(c.eMailId) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(c.contactPerson) LIKE LOWER(CONCAT('%', :keyword, '%'))
           """)
    Page<SosCustomerMasterView> searchPaginated(
            @Param("keyword") String keyword, Pageable pageable);
}