package com.sospl.inventory.repository.rmissue;

import com.sospl.inventory.model.rmissue.SosRmIssueDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SosRmIssueDetailsRepository
        extends JpaRepository<SosRmIssueDetails, Long> {

    // Find by rm_issue_id
    List<SosRmIssueDetails> findAllByRmIssueIdAndIsDeletedFalse(
            Long rmIssueId);

    // Find by rm_req_detls_id
    List<SosRmIssueDetails> findAllByRmReqDetlsIdAndIsDeletedFalse(
            Long rmReqDetlsId);

    // Find by rm_receipt_id
    List<SosRmIssueDetails> findAllByRmReceiptIdAndIsDeletedFalse(
            Long rmReceiptId);

    // Find all active
    List<SosRmIssueDetails> findAllByIsActiveTrueAndIsDeletedFalse();

    // Get total issued qty for a rm_req_detls_id
    @Query(value = """
           SELECT COALESCE(SUM(issue_qty), 0)
           FROM sos_rm_issue_details_t
           WHERE rm_req_detls_id = :rmReqDetlsId
           AND is_deleted = 0
           """, nativeQuery = true)
    java.math.BigDecimal getTotalIssuedQtyByRmReqDetlsId(
            @Param("rmReqDetlsId") Long rmReqDetlsId);
}