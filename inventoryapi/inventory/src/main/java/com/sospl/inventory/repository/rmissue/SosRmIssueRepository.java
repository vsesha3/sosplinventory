package com.sospl.inventory.repository.rmissue;

import com.sospl.inventory.model.rmissue.SosRmIssue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SosRmIssueRepository
        extends JpaRepository<SosRmIssue, Long> {

    // Find all active
    List<SosRmIssue> findAllByIsActiveTrueAndIsDeletedFalse();

    // Find all active paginated
    Page<SosRmIssue> findAllByIsActiveTrueAndIsDeletedFalse(
            Pageable pageable);

    // Find by rm_req_id
    List<SosRmIssue> findAllByRmReqIdAndIsDeletedFalse(
            Long rmReqId);

    // Find by rm_req_detls_id
    List<SosRmIssue> findAllByRmReqDetlsIdAndIsDeletedFalse(
            Long rmReqDetlsId);

    // Search
    @Query("""
           SELECT r FROM SosRmIssue r
           WHERE r.isDeleted = false
           AND (
               LOWER(r.issueShift) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(r.receivedBy) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(r.issueBy) LIKE LOWER(CONCAT('%', :keyword, '%'))
           )
           """)
    Page<SosRmIssue> search(
            @Param("keyword") String keyword,
            Pageable pageable);
}