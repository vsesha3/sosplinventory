package com.sospl.inventory.service.rmrequest.impl;

import com.sospl.inventory.dto.common.PagedResponse;
import com.sospl.inventory.dto.rmrequest.SosRmRequestDto;
import com.sospl.inventory.dto.rmrequest.SosRmRequestLineDto;
import com.sospl.inventory.dto.rmrequest.SosRmRequestViewResponse;
import com.sospl.inventory.model.rmrequest.SosRmRequest;
import com.sospl.inventory.model.rmrequest.SosRmRequestDetls;
import com.sospl.inventory.repository.rmrequest.SosRmRequestDetlsRepository;
import com.sospl.inventory.repository.rmrequest.SosRmRequestRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.rmrequest.SosRmRequestService;
import com.sospl.inventory.util.ParseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SosRmRequestServiceImpl
        extends BaseMasterServiceImpl<SosRmRequest, Long>
        implements SosRmRequestService {

    private static final Logger log =
            LoggerFactory.getLogger(SosRmRequestServiceImpl.class);

    private final SosRmRequestRepository rmRequestRepository;
    private final SosRmRequestDetlsRepository rmRequestDetlsRepository;

    public SosRmRequestServiceImpl(
            SosRmRequestRepository repository,
            SosRmRequestDetlsRepository rmRequestDetlsRepository) {
        super(repository);
        this.rmRequestRepository      = repository;
        this.rmRequestDetlsRepository = rmRequestDetlsRepository;
    }

    // ── Save header + lines ───────────────────────────────────────────────
    @Override
    @Transactional
    public Long saveRmRequest(SosRmRequestDto request) {

        SosRmRequest header = request.getRmReqId() != null
                ? rmRequestRepository
                        .findById(ParseUtil.parseLong(
                                request.getRmReqId()))
                        .orElse(new SosRmRequest())
                : new SosRmRequest();

        boolean isNew = header.getRmReqId() == null;
        if(isNew) {
        	 Long nextGinNo = rmRequestRepository.getNextGinNo();
             request.setGinNo(String.valueOf(nextGinNo));
             log.info("Generated gin_no: {}", nextGinNo);
        }
       

        header.setWoId(ParseUtil.parseLong(request.getWoId()));
        header.setProductionPlanId(ParseUtil.parseLong(
                request.getProductionPlanId()));
        header.setRmReqDate(ParseUtil.parseDateTime(
                request.getRmReqDate()));
        header.setScheduleDate(ParseUtil.parseDateTime(
                request.getScheduleDate()));
        header.setPlanToProdQty(ParseUtil.parseBigDecimal(
                request.getPlanToProdQty()));
        header.setProductionLotNumber(request.getProductionLotNumber());
        header.setRequestBy(request.getRequestBy());
        header.setGinNo(request.getGinNo());
        header.setIsRmIssueCompleted(
                request.getIsRmIssueCompleted() != null
                && request.getIsRmIssueCompleted()
                        .equalsIgnoreCase("true"));
        header.setIsActive(true);
        header.setIsDeleted(false);

        if (isNew) {
            header.setCreatedAt(LocalDateTime.now());
            log.info("Creating new RM request for woId: {}",
                    request.getWoId());
        } else {
            header.setUpdatedAt(LocalDateTime.now());
            log.info("Updating RM request — rmReqId: {}",
                    header.getRmReqId());
        }

        SosRmRequest savedHeader = rmRequestRepository.save(header);
        Long rmReqId = savedHeader.getRmReqId();
        log.info("Header saved — rmReqId: {}", rmReqId);

        if (request.getLines() != null
                && !request.getLines().isEmpty()) {
            for (SosRmRequestLineDto line : request.getLines()) {

                Long rmId = ParseUtil.parseLong(line.getRmId());

                SosRmRequestDetls detls = rmRequestDetlsRepository
                        .findAllByRmReqIdAndIsDeletedFalse(rmReqId)
                        .stream()
                        .filter(d -> d.getRmId() != null
                                && d.getRmId().equals(rmId))
                        .findFirst()
                        .orElse(new SosRmRequestDetls());

                boolean isNewLine = detls.getRmReqDetlsId() == null;

                detls.setRmReqId(rmReqId);
                detls.setRmId(rmId);
                detls.setQty(ParseUtil.parseBigDecimal(line.getQty()));
                detls.setIsActive(true);
                detls.setIsDeleted(false);

                if (isNewLine) {
                    detls.setCreatedAt(LocalDateTime.now());
                    log.info("Creating new RM request line — rmId: {}",
                            rmId);
                } else {
                    detls.setUpdatedAt(LocalDateTime.now());
                    log.info("Updating RM request line — rmId: {}",
                            rmId);
                }

                rmRequestDetlsRepository.save(detls);
            }
        }

        return rmReqId;
    }

    // ── Fetch ─────────────────────────────────────────────────────────────

    @Override
    public List<SosRmRequest> findAllActive() {
        return rmRequestRepository
                .findAllByIsActiveTrueAndIsDeletedFalse();
    }

    @Override
    public List<SosRmRequest> findByWoId(Long woId) {
        return rmRequestRepository
                .findAllByWoIdAndIsDeletedFalse(woId);
    }

    @Override
    public List<SosRmRequest> findByProductionPlanId(
            Long productionPlanId) {
        return rmRequestRepository
                .findAllByProductionPlanIdAndIsDeletedFalse(
                        productionPlanId);
    }

    @Override
    public List<SosRmRequest> findPendingRequests() {
        return rmRequestRepository
                .findAllByIsRmIssueCompletedAndIsDeletedFalse(false);
    }

    @Override
    public List<SosRmRequestDetls> findLinesByRmReqId(Long rmReqId) {
        return rmRequestDetlsRepository
                .findAllByRmReqIdAndIsDeletedFalse(rmReqId);
    }

    // ── Soft Delete ───────────────────────────────────────────────────────

    @Override
    public void softDelete(Long id, String deletedBy) {
        SosRmRequest existing = rmRequestRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "RM request not found: " + id));
        existing.setIsDeleted(true);
        existing.setIsActive(false);
        existing.setDeletedBy(deletedBy);
        existing.setDeletedAt(LocalDateTime.now());
        rmRequestRepository.save(existing);
        log.info("RM request soft deleted — id: {}", id);
    }

    @Override
    public void softDeleteLine(Long lineId, String deletedBy) {
        SosRmRequestDetls existing = rmRequestDetlsRepository
                .findById(lineId)
                .orElseThrow(() -> new RuntimeException(
                        "RM request line not found: " + lineId));
        existing.setIsDeleted(true);
        existing.setIsActive(false);
        existing.setDeletedBy(deletedBy);
        existing.setDeletedAt(LocalDateTime.now());
        rmRequestDetlsRepository.save(existing);
        log.info("RM request line soft deleted — lineId: {}", lineId);
    }

    // ── Paginated view ────────────────────────────────────────────────────

    @Override
    public PagedResponse<SosRmRequestViewResponse> findAllRmRequestView(
            int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Object[]> pageData = rmRequestRepository
                .findAllRmRequestView(pageable);

        List<SosRmRequestViewResponse> content = pageData
                .getContent()
                .stream()
                .filter(row -> row != null && row[0] != null)
                .map(row -> {
                    SosRmRequestViewResponse res =
                            new SosRmRequestViewResponse();
                    res.setRmReqId(ParseUtil.toLong(row[0]));
                    res.setRmReqDate(ParseUtil.toLocalDateTime(row[1]));
                    res.setWoId(ParseUtil.toLong(row[2]));
                    res.setWoCode(ParseUtil.toString(row[3]));
                    res.setCreatedBy(ParseUtil.toString(row[4]));
                    res.setCreatedOn(ParseUtil.toLocalDateTime(row[5]));
                    res.setLastUpdatedBy(ParseUtil.toString(row[6]));
                    res.setLastUpdatedOn(
                            ParseUtil.toLocalDateTime(row[7]));
                    res.setIsActive(ParseUtil.toBoolean(row[8]));
                    res.setRequestBy(ParseUtil.toString(row[9]));
                    res.setScheduleDate(
                            ParseUtil.toLocalDateTime(row[10]));
                    res.setPlanToProdQty(
                            ParseUtil.toBigDecimal(row[11]));
                    res.setProductionLotNumber(
                            ParseUtil.toString(row[12]));
                    res.setIsRmIssueCompleted(
                            ParseUtil.toBoolean(row[13]));
                    res.setCompanyId(ParseUtil.toLong(row[14]));
                    
                    res.setGinNo(ParseUtil.toLong(row[15]));
                    res.setProductCode(ParseUtil.toString(row[16]));  // ← new
                    res.setProductName(ParseUtil.toString(row[17]));  // ← new
                    return res;
                })
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                pageData.getNumber(),
                pageData.getSize(),
                pageData.getTotalElements(),
                pageData.getTotalPages(),
                pageData.isFirst(),
                pageData.isLast());
    }
}