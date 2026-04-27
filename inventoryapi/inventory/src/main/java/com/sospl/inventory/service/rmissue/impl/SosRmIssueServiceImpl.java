package com.sospl.inventory.service.rmissue.impl;

import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.rmissue.SosRmIssueDto;
import com.sospl.inventory.dto.rmissue.SosRmIssueLineDto;
import com.sospl.inventory.dto.rmissue.SosRmIssueLineResponse;
import com.sospl.inventory.dto.rmissue.SosRmIssueResponse;
import com.sospl.inventory.model.rmissue.SosRmIssue;
import com.sospl.inventory.model.rmissue.SosRmIssueDetails;
import com.sospl.inventory.repository.rmissue.SosRmIssueDetailsRepository;
import com.sospl.inventory.repository.rmissue.SosRmIssueRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.rmissue.SosRmIssueService;
import com.sospl.inventory.util.ParseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SosRmIssueServiceImpl
        extends BaseMasterServiceImpl<SosRmIssue, Long>
        implements SosRmIssueService {

    private static final Logger log =
            LoggerFactory.getLogger(SosRmIssueServiceImpl.class);

    private final SosRmIssueRepository rmIssueRepository;
    private final SosRmIssueDetailsRepository rmIssueDetailsRepository;

    public SosRmIssueServiceImpl(
            SosRmIssueRepository repository,
            SosRmIssueDetailsRepository rmIssueDetailsRepository) {
        super(repository);
        this.rmIssueRepository        = repository;
        this.rmIssueDetailsRepository = rmIssueDetailsRepository;
    }

    // ── Save header + lines ───────────────────────────────────────────────
    @Override
    @Transactional
    public Long saveRmIssue(SosRmIssueDto request) {

        // ── Step 1 — Check existing header ────────────────────────────────
        SosRmIssue header = request.getRmIssueId() != null
                ? rmIssueRepository
                        .findById(ParseUtil.parseLong(
                                request.getRmIssueId()))
                        .orElse(new SosRmIssue())
                : new SosRmIssue();

        boolean isNew = header.getRmIssueId() == null;

        // ── Step 2 — Map header fields ────────────────────────────────────
        header.setRmReqId(ParseUtil.parseLong(request.getRmReqId()));
        header.setRmReqDetlsId(ParseUtil.parseLong(
                request.getRmReqDetlsId()));
        header.setIssueDate(ParseUtil.parseDate(
                request.getIssueDate()));
        header.setIssueShift(request.getIssueShift());
        header.setIssueTime(request.getIssueTime() != null
                ? LocalTime.parse(request.getIssueTime()) : null);
        header.setReceivedBy(request.getReceivedBy());
        header.setIssueBy(request.getIssueBy());
        header.setIsActive(true);
        header.setIsDeleted(false);

        if (isNew) {
            header.setCreatedAt(LocalDateTime.now());
            log.info("Creating new RM issue for rmReqId: {}",
                    request.getRmReqId());
        } else {
            header.setUpdatedAt(LocalDateTime.now());
            log.info("Updating RM issue — rmIssueId: {}",
                    header.getRmIssueId());
        }

        // ── Step 3 — Save header ──────────────────────────────────────────
        SosRmIssue savedHeader = rmIssueRepository.save(header);
        Long rmIssueId = savedHeader.getRmIssueId();
        log.info("Header saved — rmIssueId: {}", rmIssueId);

        // ── Step 4 — Save lines ───────────────────────────────────────────
        if (request.getLines() != null
                && !request.getLines().isEmpty()) {
            for (SosRmIssueLineDto line : request.getLines()) {

                Long rmReqDetlsId = ParseUtil.parseLong(
                        line.getRmReqDetlsId());

                // Upsert — check existing line
                SosRmIssueDetails details = line.getRmIssueDetailsId()
                        != null
                        ? rmIssueDetailsRepository
                                .findById(ParseUtil.parseLong(
                                        line.getRmIssueDetailsId()))
                                .orElse(new SosRmIssueDetails())
                        : new SosRmIssueDetails();

                boolean isNewLine =
                        details.getRmIssueDetailsId() == null;

                details.setRmIssueId(rmIssueId);
                details.setRmReqDetlsId(rmReqDetlsId);
                details.setRmReceiptId(ParseUtil.parseLong(
                        line.getRmReceiptId()));
                details.setIssueQty(ParseUtil.parseBigDecimal(
                        line.getIssueQty()));
                details.setRemark(line.getRemark());
                details.setIsActive(true);
                details.setIsDeleted(false);

                if (isNewLine) {
                    details.setCreatedAt(LocalDateTime.now());
                    log.info("Creating new issue line — "
                            + "rmReqDetlsId: {}", rmReqDetlsId);
                } else {
                    details.setUpdatedAt(LocalDateTime.now());
                    log.info("Updating issue line — "
                            + "rmIssueDetailsId: {}",
                            details.getRmIssueDetailsId());
                }

                rmIssueDetailsRepository.save(details);
            }
        }

        return rmIssueId;
    }

    // ── Fetch ─────────────────────────────────────────────────────────────

    @Override
    public List<SosRmIssue> findAllActive() {
        return rmIssueRepository
                .findAllByIsActiveTrueAndIsDeletedFalse();
    }

    @Override
    public PagedResponse<SosRmIssue> findAllActivePaginated(
            int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SosRmIssue> pageData = rmIssueRepository
                .findAllByIsActiveTrueAndIsDeletedFalse(pageable);
        return new PagedResponse<>(
                pageData.getContent(),
                pageData.getNumber(),
                pageData.getSize(),
                pageData.getTotalElements(),
                pageData.getTotalPages(),
                pageData.isFirst(),
                pageData.isLast());
    }

    @Override
    public List<SosRmIssue> findByRmReqId(Long rmReqId) {
        return rmIssueRepository
                .findAllByRmReqIdAndIsDeletedFalse(rmReqId);
    }

    @Override
    public List<SosRmIssue> findByRmReqDetlsId(Long rmReqDetlsId) {
        return rmIssueRepository
                .findAllByRmReqDetlsIdAndIsDeletedFalse(rmReqDetlsId);
    }

    @Override
    public SosRmIssueResponse findFullIssueById(Long rmIssueId) {

        SosRmIssue issue = rmIssueRepository
                .findById(rmIssueId)
                .orElseThrow(() -> new RuntimeException(
                        "RM issue not found: " + rmIssueId));

        // Map header
        SosRmIssueResponse response = new SosRmIssueResponse();
        response.setRmIssueId(issue.getRmIssueId());
        response.setIssueDate(issue.getIssueDate());
        response.setIssueShift(issue.getIssueShift());
        response.setIssueTime(issue.getIssueTime());
        response.setRmReqDetlsId(issue.getRmReqDetlsId());
        response.setReceivedBy(issue.getReceivedBy());
        response.setIssueBy(issue.getIssueBy());
        response.setRmReqId(issue.getRmReqId());
        response.setCreatedBy(issue.getCreatedBy());
        response.setUpdatedBy(issue.getUpdatedBy());

        // Map lines
        List<SosRmIssueLineResponse> lines =
                rmIssueDetailsRepository
                        .findAllByRmIssueIdAndIsDeletedFalse(
                                rmIssueId)
                        .stream()
                        .map(detail -> {
                            SosRmIssueLineResponse lineRes =
                                    new SosRmIssueLineResponse();
                            lineRes.setRmIssueDetailsId(
                                    detail.getRmIssueDetailsId());
                            lineRes.setRmIssueId(
                                    detail.getRmIssueId());
                            lineRes.setIssueQty(detail.getIssueQty());
                            lineRes.setRmReceiptId(
                                    detail.getRmReceiptId());
                            lineRes.setRmReqDetlsId(
                                    detail.getRmReqDetlsId());
                            lineRes.setRemark(detail.getRemark());
                            // Total issued qty for this detls
                            lineRes.setTotalIssuedQty(
                                    rmIssueDetailsRepository
                                            .getTotalIssuedQtyByRmReqDetlsId(
                                                    detail.getRmReqDetlsId()));
                            return lineRes;
                        })
                        .collect(Collectors.toList());

        response.setLines(lines);
        return response;
    }

    @Override
    public List<SosRmIssueDetails> findLinesByRmIssueId(
            Long rmIssueId) {
        return rmIssueDetailsRepository
                .findAllByRmIssueIdAndIsDeletedFalse(rmIssueId);
    }

    @Override
    public PagedResponse<SosRmIssue> search(
            String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SosRmIssue> pageData = rmIssueRepository
                .search(keyword, pageable);
        return new PagedResponse<>(
                pageData.getContent(),
                pageData.getNumber(),
                pageData.getSize(),
                pageData.getTotalElements(),
                pageData.getTotalPages(),
                pageData.isFirst(),
                pageData.isLast());
    }

    // ── Soft Delete ───────────────────────────────────────────────────────

    @Override
    public void softDelete(Long id, String deletedBy) {
        SosRmIssue existing = rmIssueRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "RM issue not found: " + id));
        existing.setIsDeleted(true);
        existing.setIsActive(false);
        existing.setDeletedBy(deletedBy);
        existing.setDeletedAt(LocalDateTime.now());
        rmIssueRepository.save(existing);
        log.info("RM issue soft deleted — id: {}", id);
    }

    @Override
    public void softDeleteLine(Long lineId, String deletedBy) {
        SosRmIssueDetails existing = rmIssueDetailsRepository
                .findById(lineId)
                .orElseThrow(() -> new RuntimeException(
                        "RM issue line not found: " + lineId));
        existing.setIsDeleted(true);
        existing.setIsActive(false);
        existing.setDeletedBy(deletedBy);
        existing.setDeletedAt(LocalDateTime.now());
        rmIssueDetailsRepository.save(existing);
        log.info("RM issue line soft deleted — lineId: {}", lineId);
    }
}