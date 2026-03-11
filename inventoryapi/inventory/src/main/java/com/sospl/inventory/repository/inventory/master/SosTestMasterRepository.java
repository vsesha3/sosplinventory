package com.sospl.inventory.repository.inventory.master;

import com.sospl.inventory.model.inventory.master.SosTestMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosTestMasterRepository
        extends JpaRepository<SosTestMaster, Long> {

    List<SosTestMaster> findAllByIsDeletedFalse();

    List<SosTestMaster> findAllByIsActiveTrueAndIsDeletedFalse();

    Optional<SosTestMaster> findByTestIdAndIsDeletedFalse(Long testId);

    Boolean existsByTestId(Long testId);

    Boolean existsByTestNameIgnoreCaseAndIsDeletedFalse(String testName);

    // Get all paginated
    @Query("""
           SELECT t FROM SosTestMaster t
           WHERE t.isActive = true AND t.isDeleted = false
           """)
    Page<SosTestMaster> findAllActivePaginated(Pageable pageable);

    // Search paginated
    @Query("""
           SELECT t FROM SosTestMaster t
           WHERE (t.isActive = true AND t.isDeleted = false)
           AND (
               LOWER(t.testName) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(t.testCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
           )
           """)
    Page<SosTestMaster> searchPaginated(
            @Param("keyword") String keyword, Pageable pageable);
}