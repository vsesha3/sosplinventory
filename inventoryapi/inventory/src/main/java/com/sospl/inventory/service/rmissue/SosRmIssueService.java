package com.sospl.inventory.service.rmissue;

import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.rmissue.SosRmIssueDto;
import com.sospl.inventory.dto.rmissue.SosRmIssueResponse;
import com.sospl.inventory.model.rmissue.SosRmIssue;
import com.sospl.inventory.model.rmissue.SosRmIssueDetails;
import com.sospl.inventory.service.common.BaseMasterService;

import java.util.List;

public interface SosRmIssueService
        extends BaseMasterService<SosRmIssue, Long> {

    // ── Save header + lines ───────────────────────────────────────────────
    Long saveRmIssue(SosRmIssueDto request);

    // ── Fetch ─────────────────────────────────────────────────────────────
    List<SosRmIssue> findAllActive();

    PagedResponse<SosRmIssue> findAllActivePaginated(
            int page, int size);

    List<SosRmIssue> findByRmReqId(Long rmReqId);

    List<SosRmIssue> findByRmReqDetlsId(Long rmReqDetlsId);

    SosRmIssueResponse findFullIssueById(Long rmIssueId);

    List<SosRmIssueDetails> findLinesByRmIssueId(Long rmIssueId);

    PagedResponse<SosRmIssue> search(
            String keyword, int page, int size);

    // ── Soft Delete ───────────────────────────────────────────────────────
    void softDelete(Long id, String deletedBy);

    void softDeleteLine(Long lineId, String deletedBy);
}