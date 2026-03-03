package com.sospl.inventory.repository.inventory.master;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



import java.util.List;
import java.util.Optional;
import com.sospl.inventory.model.inventory.master.SosCustomerMaster;
import com.sospl.inventory.model.inventory.master.SosSupplierMaster;




@Repository
public interface SosSupplierMasterRepository extends JpaRepository<SosSupplierMaster, Long> {

    List<SosSupplierMaster> findAllByIsDeletedFalse();

    List<SosSupplierMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosSupplierMaster> findBySupplierIdAndIsDeletedFalse(Integer supplierId);

    Boolean existsBySupplierId(Integer supplierId);

    Boolean existsBySupplierNameIgnoreCaseAndIsDeletedFalse(String supplierName);

    List<SosSupplierMaster> findBySupplierNameContainingIgnoreCaseAndIsDeletedFalse(String keyword);
}