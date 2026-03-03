package com.sospl.inventory.repository.inventory.master;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



import java.util.List;
import java.util.Optional;
import com.sospl.inventory.model.inventory.master.SosCustomerMaster;


@Repository
public interface SosCustomerMasterRepository extends JpaRepository<SosCustomerMaster, Long> {

    List<SosCustomerMaster> findAllByIsDeletedFalse();

    List<SosCustomerMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosCustomerMaster> findByCustomerIdAndIsDeletedFalse(Integer customerId);

    Boolean existsByCustomerId(Integer customerId);

    Boolean existsByCustomerNameIgnoreCaseAndIsDeletedFalse(String customerName);

    List<SosCustomerMaster> findByCustomerNameContainingIgnoreCaseAndIsDeletedFalse(String keyword);
}