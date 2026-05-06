package com.sospl.inventory.service.impl;

import com.sospl.inventory.dto.inventory.SosMaterialReceiptLineRequest;
import com.sospl.inventory.dto.inventory.SosMaterialReceiptDetRequest;
import com.sospl.inventory.dto.inventory.SosMaterialReceiptSummaryResponse;
import com.sospl.inventory.dto.inventory.SosMaterialReceiptWithRMDetailsResponse;
import com.sospl.inventory.mapper.inventory.SosMaterialReceiptWithRMDetailsMapper;
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
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    
    private final SosMaterialReceiptWithRMDetailsMapper receiptWithRMMapper;
    
    private static final Logger log =
            LoggerFactory.getLogger(SosMaterialReceiptServiceImpl.class);

    public SosMaterialReceiptServiceImpl(
            SosMaterialReceiptRepository repository,
            SosMaterialReceiptDetRepository detRepository,
            SosPoDetailsRepository poDetailsRepository,
            SosPoReceiptRepository poReceiptRepository,SosMaterialReceiptWithRMDetailsMapper _receiptWithRMMapper) {
        super(repository);
        this.receiptRepository = repository;
        this.detRepository = detRepository;
        this.poDetailsRepository = poDetailsRepository;
        this.poReceiptRepository = poReceiptRepository;
        this.receiptWithRMMapper = _receiptWithRMMapper;
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
    public Long saveReceipt(SosMaterialReceiptDetRequest request) {

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
        det.setFreightGst(request.getFreightGst());
        

        if (isNew) {
            det.setCreatedAt(LocalDateTime.now());
            Long grnNo = detRepository.getNextGrnNo();
            det.setGrnNo(ParseUtil.toString(grnNo));
            
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
                
                String lotNo = line.getLotNumber();

                if (lotNo == null || lotNo.isBlank()) {
                    // Generate lot number — materialId + timestamp
                    String materialId = line.getPoRmCode() != null
                            ? line.getPoRmCode()
                            : "RM";
                    String timestamp = LocalDateTime.now()
                            .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
                    lotNo = materialId + "-" + timestamp;
                    log.info("Generated lot number: {}", lotNo);
                }

                receipt.setLotNo(lotNo);

                receipt.setMaterialType(request.getPoType());
                receipt.setReceiptDetId(receiptDetId);
                receipt.setReceiptMainId(receiptDetId);
                receipt.setMaterialId(ParseUtil.toLong(line.getPoRmCode()));
                receipt.setPoRefNo(poRefNo);
                receipt.setPoDetId(poDetId);
                receipt.setQty(ParseUtil.parseBigDecimal(
                        line.getRmReceivedQty()));
                receipt.setPerUnitRate(ParseUtil.parseBigDecimal(
                        line.getReceivedRate()));
                receipt.setNoOfReceived(ParseUtil.parseInteger(
                        line.getRmReceivedQty()));
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
    @Override
    public List<SosMaterialReceiptSummaryResponse> findAllReceiptSummary() {
        return mapToSummaryResponse(
                detRepository.findAllReceiptSummary());
    }

    @Override
    public List<SosMaterialReceiptSummaryResponse> findAllReceiptSummaryByMaterialType(
            String materialType) {
        return mapToSummaryResponse(
                detRepository.findAllReceiptSummaryByMaterialType(
                        materialType));
    }
    
    public List<SosMaterialReceiptSummaryResponse> findAllReceiptSummaryByPoRefNo(
            Long poRefNo) {
        return mapToSummaryResponse(
                detRepository.findAllReceiptSummaryByPoRefNo(
                        poRefNo));
    }
    
    

    private List<SosMaterialReceiptSummaryResponse> mapToSummaryResponse(
            List<Object[]> results) {
        return results.stream()
                .map(row -> {
                    SosMaterialReceiptSummaryResponse res =
                            new SosMaterialReceiptSummaryResponse();
                    res.setReceiptDetId(ParseUtil.toLong(row[0]));
                    res.setPoRefNo(ParseUtil.toLong(row[1]));
                    res.setMaterialType(ParseUtil.toString(row[2]));
                    res.setInvoiceNo(ParseUtil.toString(row[3]));
                    res.setSupplierId(ParseUtil.toLong(row[4]));
                    res.setInvoiceDate(ParseUtil.toString(row[5]));
                    res.setSgstValue(ParseUtil.toBigDecimal(row[6]));
                    res.setCgstValue(ParseUtil.toBigDecimal(row[7]));
                    res.setIgstValue(ParseUtil.toBigDecimal(row[8]));
                    res.setNoOfReceived(ParseUtil.toBigDecimal(row[9]));
                    res.setNetAmount(ParseUtil.toBigDecimal(row[10]));
                    res.setTotalAmount(ParseUtil.toBigDecimal(row[11]));
                    return res;
                })
                .collect(Collectors.toList());
    }

  
    
    @Override
    public SosMaterialReceiptDetRequest findFullReceiptByReceiptDetId(
            Long receiptDetId) {
        SosMaterialReceiptDet det = detRepository
                .findById(receiptDetId)
                .orElse(null);
        if (det == null) return null;
        return mapToDetRequest(det);
    }


   
    
    private SosMaterialReceiptDetRequest mapToDetRequest(
            SosMaterialReceiptDet det) {

        SosMaterialReceiptDetRequest request =
                new SosMaterialReceiptDetRequest();

        // ── Header fields ─────────────────────────────────────────────────────
        request.setPoRefNo(String.valueOf(det.getPoRefNo()) != null
                ? String.valueOf(det.getPoRefNo()) : null);
        request.setPoType(det.getMaterialType());
        request.setGrnNo(det.getGrnNo());
        request.setIrcNo(det.getIrcNo());
        request.setStnCommercialInvoiceNo(det.getInvoiceNo());
        request.setInvoiceDate(det.getInvoiceDate() != null
                ? det.getInvoiceDate().toString() : null);
        request.setSupplierId(det.getSupplierId() != null
                ? String.valueOf(det.getSupplierId()) : null);
        request.setTransporterId(det.getTransporterId() != null
                ? String.valueOf(det.getTransporterId()) : null);
        request.setSapPo(det.getSapPo());
        request.setLrNumber(det.getLrNumber());
        request.setModvatCopyNo(det.getModvatCopyNo());
        request.setFreight(det.getFreightRs() != null
                ? det.getFreightRs().toPlainString() : null);
        request.setFreightGst(det.getFreightGst());
        request.setDateTimeOfReceipt(det.getReceiptDateTime() != null
                ? det.getReceiptDateTime().toString() : null);
        request.setActualDateTimeOfReceipt(
                det.getActualReceiptDateTime() != null
                ? det.getActualReceiptDateTime().toString() : null);

        // ── Lines — from sos_material_receipt_t ──────────────────────────────
        List<SosMaterialReceipt> receiptLines = receiptRepository
                .findAllByReceiptMainIdAndIsDeletedFalse(
                        det.getReceiptDetId());

        List<SosMaterialReceiptLineRequest> lines = receiptLines.stream()
                .map(line -> {
                    SosMaterialReceiptLineRequest lineReq =
                            new SosMaterialReceiptLineRequest();
                    lineReq.setPoDetId(line.getPoDetId() != null
                            ? String.valueOf(line.getPoDetId()) : null);
                    lineReq.setRmReceivedQty(line.getQty() != null
                            ? line.getQty().toPlainString() : null);
                    lineReq.setReceivedRate(line.getPerUnitRate() != null
                            ? line.getPerUnitRate().toPlainString() : null);
                    lineReq.setLotNumber(line.getLotNo());
                    lineReq.setExpectedDeliveryDate(line.getDom() != null
                            ? line.getDom().toString() : null);
                   
                    // ── Get receipt info from sos_po_receipt_t ────────────────
                    if (line.getPoDetId() != null
                            && det.getReceiptDetId() != null) {
                        poReceiptRepository
                                .findByPoDetIdAndReceiptDetIdAndIsDeletedFalse(
                                        line.getPoDetId(),
                                        det.getReceiptDetId())
                                .ifPresent(pr -> {
                                    lineReq.setInspectedBy(
                                            pr.getInspectedBy());
                                    lineReq.setApprovedBy(
                                            pr.getApprovedBy());
                                    lineReq.setActualDeliveryDate(
                                            pr.getActDateDel() != null
                                            ? pr.getActDateDel().toString()
                                            : null);
                                    lineReq.setRmReceivedQty(
                                            pr.getRmReceivedQty() != null
                                            ? pr.getRmReceivedQty()
                                                    .toPlainString()
                                            : null);
                                    lineReq.setRmOrderQty(pr.getRmOrdQty() != null
                                            ? String.valueOf(pr.getRmOrdQty()) : null);

                                });

                        // ── Get po details for rm code, name, uom ────────────
                        poDetailsRepository.findById(line.getPoDetId())
                                .ifPresent(pd -> {
                                    lineReq.setPoRmCode(pd.getPoRmCode());
                                    lineReq.setPoRmName(pd.getPoRmName());
                                    lineReq.setPoUom(pd.getPoUom());
                                    lineReq.setSgst(pd.getSgst() != null
                                            ? pd.getSgst().toPlainString()
                                            : null);
                                    lineReq.setCgst(pd.getCgst() != null
                                            ? pd.getCgst().toPlainString()
                                            : null);
                                    lineReq.setIgst(pd.getIgst() != null
                                            ? pd.getIgst().toPlainString()
                                            : null);
                                });
                    }
                    return lineReq;
                })
                .collect(Collectors.toList());

        request.setLines(lines);
        return request;
    }


	@Override
	public List<SosMaterialReceiptDetRequest> findFullReceiptByPoRefNo(Long poRefNo) {
		// TODO Auto-generated method stub
		 return detRepository
		            .findAllByPoRefNoAndIsDeletedFalse(poRefNo)
		            .stream()
		            .map(this::mapToDetRequest)
		            .collect(Collectors.toList());
	
	}
    
   
}