package com.sospl.inventory.service.impl;

import com.sospl.inventory.dto.inventory.SosMaterialReceiptLineRequest;
import com.sospl.inventory.dto.inventory.SosMaterialReceiptRequest;
import com.sospl.inventory.model.SosMaterialReceipt;
import com.sospl.inventory.model.SosMaterialReceiptDet;
import com.sospl.inventory.model.SosPoReceipt;
import com.sospl.inventory.repository.SosMaterialReceiptDetRepository;
import com.sospl.inventory.repository.SosPoDetailsRepository;
import com.sospl.inventory.repository.SosPoReceiptRepository;
import com.sospl.inventory.repository.inventory.SosMaterialReceiptRepository;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.SosMaterialReceiptService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.sospl.inventory.util.ParseUtil;

@Service
public class SosMaterialReceiptServiceImpl
        extends BaseMasterServiceImpl<SosMaterialReceipt, Long>
        implements SosMaterialReceiptService {

    private final SosMaterialReceiptRepository receiptRepository;
    
    private final SosMaterialReceiptDetRepository detRepository;
    private final SosPoDetailsRepository poDetailsRepository;
    
    private final SosPoReceiptRepository poReceiptRepository;
    
    private static final Logger log =
            LoggerFactory.getLogger(SosMaterialReceiptServiceImpl.class);

    public SosMaterialReceiptServiceImpl(
            SosMaterialReceiptRepository repository,
            SosMaterialReceiptDetRepository detRepository,
            SosPoDetailsRepository poDetailsRepository,
            SosPoReceiptRepository poReceiptRepository) {
        super(repository);
        this.receiptRepository = repository;
        this.detRepository = detRepository;
        this.poDetailsRepository = poDetailsRepository;
        this.poReceiptRepository = poReceiptRepository;
    }

    
    @Override
    public List<SosMaterialReceipt> findAllByMaterialType(
            String materialType) {
        return receiptRepository
                .findAllByMaterialTypeAndIsDeletedFalse(materialType);
    }

    @Override
    public Page<SosMaterialReceipt> findAllByMaterialType(
            String materialType, Pageable pageable) {
        return receiptRepository
                .findAllByMaterialTypeAndIsDeletedFalse(
                        materialType, pageable);
    }

    @Override
    public List<SosMaterialReceipt> findByPoRefNo(
            Long poRefNo, String materialType) {
        return receiptRepository
                .findAllByPoRefNoAndMaterialTypeAndIsDeletedFalse(
                        poRefNo, materialType);
    }

    @Override
    public Page<SosMaterialReceipt> search(
            String materialType, String keyword, Pageable pageable) {
        return receiptRepository
                .searchByMaterialType(materialType, keyword, pageable);
    }

    @Override
    public void softDelete(Long receiptId, String deletedBy) {
        SosMaterialReceipt existing = receiptRepository
                .findById(receiptId)
                .orElseThrow(() -> new RuntimeException(
                        "Receipt not found: " + receiptId));
        existing.setIsDeleted(true);
        existing.setIsActive(false);
        existing.setDeletedBy(deletedBy);
        existing.setDeletedAt(LocalDateTime.now());
        receiptRepository.save(existing);
    }
    
    @Override
    @Transactional
    public Long saveReceipt(SosMaterialReceiptRequest request) {

        Long poRefNo = ParseUtil.parseLong(request.getPoRefNo());

        // ── Step 1 — Save or Update header ───────────────────────────────────
        SosMaterialReceiptDet det = detRepository
                .findByPoRefNoAndIsDeletedFalse(poRefNo)
                .orElse(new SosMaterialReceiptDet());

        boolean isNew = det.getReceiptDetId() == null;

        det.setMaterialType(request.getPoType());
        det.setGrnNo(request.getGrnNo());
        det.setIrcNo(request.getIrcNo());
        det.setInvoiceNo(request.getStnCommercialInvoiceNo());
        det.setModvatCopyNo(request.getModvatCopyNo());
        det.setSapPo(request.getSapPo());
        det.setLrNumber(request.getLrNumber());
        det.setIsActive(true);
        det.setIsDeleted(false);
        det.setPoRefNo(ParseUtil.parseInteger(request.getPoRefNo()));
        det.setSupplierId(ParseUtil.parseLong(request.getSupplierId()));
        det.setTransporterId(ParseUtil.parseLong(request.getTransporterId()));
        det.setInvoiceDate(ParseUtil.parseDate(request.getInvoiceDate()));
        det.setReceiptDateTime(
                ParseUtil.parseDateTime(request.getDateTimeOfReceipt()));
        det.setActualReceiptDateTime(
                ParseUtil.parseDate(request.getActualDateTimeOfReceipt()));
        
        
        det.setFreightRs(ParseUtil.parseBigDecimal(request.getFreight()));

        if (isNew) {
            det.setCreatedAt(LocalDateTime.now());
            log.info("Creating new header for poRefNo: {}", poRefNo);
        } else {
            det.setUpdatedAt(LocalDateTime.now());
            log.info("Updating existing header — receiptDetId: {}",
                    det.getReceiptDetId());
        }

        SosMaterialReceiptDet savedDet = detRepository.save(det);
        Long receiptDetId = savedDet.getReceiptDetId();
        log.info("Header saved — receiptDetId: {}", receiptDetId);

        // ── Step 2 — Parse poDate ─────────────────────────────────────────────
        LocalDate poDate = ParseUtil.parseDate(request.getPoDate());

        // ── Step 3 — Save or Update each line ────────────────────────────────
        if (request.getLines() != null && !request.getLines().isEmpty()) {
            for (SosMaterialReceiptLineRequest line : request.getLines()) {

                Long poDetId = ParseUtil.parseLong(line.getPoDetId());

                // ── 3a — Upsert sos_material_receipt_t ───────────────────────
                SosMaterialReceipt receipt = (poDetId != null)
                        ? receiptRepository
                                .findByPoDetIdAndReceiptDetIdAndIsDeletedFalse(
                                        poDetId, receiptDetId)
                                .orElse(new SosMaterialReceipt())
                        : new SosMaterialReceipt();

                boolean isNewReceipt = receipt.getReceiptId() == null;

                receipt.setMaterialType(request.getPoType());
                receipt.setReceiptDetId(receiptDetId);
                receipt.setReceiptMainId(receiptDetId);
                receipt.setPoRefNo(poRefNo);
                receipt.setPoDetId(poDetId);
                receipt.setLotNo(line.getLotNumber());
                receipt.setQty(ParseUtil.parseBigDecimal(
                        line.getRmReceivedQty()));
                receipt.setPerUnitRate(ParseUtil.parseBigDecimal(
                        line.getReceivedRate()));
                receipt.setNoOfReceived(ParseUtil.parseInteger(
                        line.getRmOrderQty()));
                receipt.setDom(ParseUtil.parseDate(
                        line.getExpectedDeliveryDate()));
                receipt.setIsActive(true);
                receipt.setIsDeleted(false);

                if (isNewReceipt) {
                    receipt.setCreatedAt(LocalDateTime.now());
                    log.info("Creating new receipt line — poDetId: {}",
                            poDetId);
                } else {
                    receipt.setUpdatedAt(LocalDateTime.now());
                    log.info("Updating existing receipt line — poDetId: {}",
                            poDetId);
                }

                receiptRepository.save(receipt);

                // ── 3b — Upsert sos_po_receipt_t ─────────────────────────────
                SosPoReceipt poReceipt = (poDetId != null)
                        ? poReceiptRepository
                                .findByPoDetIdAndReceiptDetIdAndIsDeletedFalse(
                                        poDetId, receiptDetId)
                                .orElse(new SosPoReceipt())
                        : new SosPoReceipt();

                boolean isNewPoReceipt = poReceipt.getPoReceiptNo() == null;

                poReceipt.setReceiptDetId(receiptDetId);
                poReceipt.setPoNo(poRefNo);
                poReceipt.setPoDate(poDate);
                poReceipt.setPoDetId(poDetId);
                poReceipt.setRmCode(line.getPoRmCode());
                poReceipt.setRmOrdQty(ParseUtil.parseBigDecimal(
                        line.getRmOrderQty()));
                poReceipt.setRmReceivedQty(ParseUtil.parseBigDecimal(
                        line.getRmReceivedQty()));
                poReceipt.setExpDateDel(ParseUtil.parseDate(
                        line.getExpectedDeliveryDate()));
                poReceipt.setActDateDel(ParseUtil.parseDate(
                        line.getActualDeliveryDate()));
                poReceipt.setInspectedBy(line.getInspectedBy());
                poReceipt.setApprovedBy(line.getApprovedBy());
                poReceipt.setInvoiceNo(request.getStnCommercialInvoiceNo());
                poReceipt.setIsActive(true);
                poReceipt.setIsDeleted(false);

                if (isNewPoReceipt) {
                    poReceipt.setCreatedAt(LocalDateTime.now());
                    log.info("Creating new PO receipt — poDetId: {}",
                            poDetId);
                } else {
                    poReceipt.setUpdatedAt(LocalDateTime.now());
                    log.info("Updating existing PO receipt — poDetId: {}",
                            poDetId);
                }

                poReceiptRepository.save(poReceipt);

                // ── 3c — Update sos_po_details_t ─────────────────────────────
                if (poDetId != null) {
                    poDetailsRepository.findById(poDetId)
                            .ifPresent(poDetail -> {
                                poDetail.setSgst(ParseUtil.parseBigDecimal(
                                        line.getSgst()));
                                poDetail.setCgst(ParseUtil.parseBigDecimal(
                                        line.getCgst()));
                                poDetail.setIgst(ParseUtil.parseBigDecimal(
                                        line.getIgst()));
                                poDetail.setPoRate(ParseUtil.parseBigDecimal(
                                        line.getReceivedRate()));
                                poDetail.setReceiptDetId(receiptDetId);
                                poDetailsRepository.save(poDetail);
                                log.info("PO details updated — poDetId: {}",
                                        poDetId);
                            });
                }
            }
        }

        return receiptDetId;
    }
    
    @Override
    public Optional<SosMaterialReceiptDet> findHeaderByPoRefNoAndMaterialType(
            Long poRefNo) {
        return detRepository
                .findByPoRefNoAndIsDeletedFalse(
                        poRefNo);
    }

    @Override
    public Optional<SosMaterialReceiptDet> findHeaderByPoRefNo(
            Long poRefNo) {
        return detRepository
                .findByPoRefNoAndIsDeletedFalse(poRefNo);
    }
    
    
}