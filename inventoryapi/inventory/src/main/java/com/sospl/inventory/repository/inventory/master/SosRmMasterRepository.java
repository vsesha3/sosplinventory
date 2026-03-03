package com.sospl.inventory.repository.inventory.master;


import com.sospl.inventory.dto.inventory.master.SosRmMasterResponse;
import com.sospl.inventory.model.inventory.master.SosRmMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;



import java.util.List;
import java.util.Optional;


@Repository
public interface SosRmMasterRepository extends JpaRepository<SosRmMaster, Long> {

    List<SosRmMaster> findAllByIsDeletedFalse();

    List<SosRmMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosRmMaster> findByRmIdAndIsDeletedFalse(Integer rmId);

    Boolean existsByRmId(Integer rmId);

    Boolean existsByRmNameIgnoreCaseAndIsDeletedFalse(String rmName);

    List<SosRmMaster> findByRmNameContainingIgnoreCaseAndIsDeletedFalse(String keyword);
    
    @Query("""
    	       SELECT new com.sospl.inventory.dto.inventory.master.SosRmMasterResponse(
    	            r.id,
    	            r.rmCode,
    	            r.rmName,
    	            u.uomName,
    	            g.rmGroupName,
    	            t.qcTestName,
    	            r.exciseTariffNo,
    	            r.exciseDeclaredItem,
    	            r.exciseRate,
    	            r.shECessRate,
    	            r.avgRate
    	       )
    	       FROM SosRmMaster r
    	       LEFT JOIN SosUomMaster u ON r.uomId = u.uomId
    	       LEFT JOIN SosRmGroupMaster g ON r.rmGroupId = g.rmGroupId
    	       LEFT JOIN SosQcTestMaster t ON r.testId = t.qcTestId
    	       """)
    	List<SosRmMasterResponse> findAllWithDetails();
}
