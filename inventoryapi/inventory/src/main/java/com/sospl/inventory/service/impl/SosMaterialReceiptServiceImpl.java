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
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
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
    	
    	
    	 if ("JOBINWARD".equalsIgnoreCase(request.getInwardType())) {
             return saveJobInward(request);
         }

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
                receipt.setSgst(ParseUtil.parseBigDecimal(line.getSgst()));
                receipt.setCgst(ParseUtil.parseBigDecimal(line.getCgst()));
                receipt.setIgst(ParseUtil.parseBigDecimal(line.getIgst()));
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
    
    
    // ── Job work inward: header + lines only — no PO / PO receipt / PO detail rows ──
    private Long saveJobInward(SosMaterialReceiptDetRequest request) {

        // Header — existing receipt on edit, new otherwise
        SosMaterialReceiptDet det = request.getReceiptDetId() != null
                ? detRepository.findById(request.getReceiptDetId())
                        .orElseThrow(() -> new RuntimeException(
                                "Receipt not found: " + request.getReceiptDetId()))
                : new SosMaterialReceiptDet();

        boolean isNew = det.getReceiptDetId() == null;

        det.setInwardType("JOBINWARD");
        det.setPoRefNo(0);                        // no PO (column is a primitive int)
        det.setMaterialType(request.getPoType());
        det.setIrcNo(request.getIrcNo());
        det.setInvoiceNo(request.getStnCommercialInvoiceNo());
        det.setModvatCopyNo(request.getModvatCopyNo());
        det.setSapPo(request.getSapPo());
        det.setLrNumber(request.getLrNumber());
        det.setIsActive(true);
        det.setIsDeleted(false);
        det.setSupplierId(ParseUtil.parseLong(request.getSupplierId()));
        det.setTransporterId(ParseUtil.parseLong(request.getTransporterId()));
        det.setInvoiceDate(ParseUtil.parseDate(request.getInvoiceDate()));
        det.setReceiptDateTime(ParseUtil.parseDateTime(request.getDateTimeOfReceipt()));
        det.setActualReceiptDateTime(ParseUtil.parseDate(request.getActualDateTimeOfReceipt()));
        det.setFreightRs(ParseUtil.parseBigDecimal(request.getFreight()));
        det.setFreightGst(request.getFreightGst());

        if (isNew) {
            det.setCreatedAt(LocalDateTime.now());
            
            det.setJobGrnNo(detRepository.getNextJobGrnNo());
        } else {
            det.setUpdatedAt(LocalDateTime.now());
        }

        Long receiptDetId = detRepository.save(det).getReceiptDetId();
        log.info("Job inward header saved — receiptDetId: {}", receiptDetId);

        // Existing lines of this receipt, keyed by receipt_id
        Map<Long, SosMaterialReceipt> existing = receiptRepository
                .findAllByReceiptMainIdAndIsDeletedFalse(receiptDetId)
                .stream()
                .collect(Collectors.toMap(SosMaterialReceipt::getReceiptId, Function.identity()));

        Set<Long> kept = new HashSet<>();

        if (request.getLines() != null) {
            for (SosMaterialReceiptLineRequest line : request.getLines()) {

                Long receiptId = ParseUtil.parseLong(line.getReceiptId());
                SosMaterialReceipt receipt = (receiptId != null && existing.containsKey(receiptId))
                        ? existing.get(receiptId)
                        : new SosMaterialReceipt();

                boolean isNewLine = receipt.getReceiptId() == null;

                String lotNo = line.getLotNumber();
                if (lotNo == null || lotNo.isBlank()) {
                    String materialId = line.getPoRmCode() != null ? line.getPoRmCode() : "JW";
                    lotNo = materialId + "-" + LocalDateTime.now()
                            .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
                    log.info("Generated lot number: {}", lotNo);
                }

                receipt.setLotNo(lotNo);
                receipt.setMaterialType(request.getPoType());
                receipt.setReceiptDetId(receiptDetId);
                receipt.setReceiptMainId(receiptDetId);
                receipt.setMaterialId(ParseUtil.parseLong(line.getPoRmCode()));
                receipt.setPoRefNo(null);
                receipt.setPoDetId(null);
                receipt.setQty(ParseUtil.parseBigDecimal(line.getRmReceivedQty()));
                receipt.setPerUnitRate(ParseUtil.parseBigDecimal(line.getReceivedRate()));
                receipt.setNoOfReceived(ParseUtil.parseInteger(line.getRmReceivedQty()));
                receipt.setDom(ParseUtil.parseDate(line.getExpectedDeliveryDate()));
                receipt.setSgst(ParseUtil.parseBigDecimal(line.getSgst()));
                receipt.setCgst(ParseUtil.parseBigDecimal(line.getCgst()));
                receipt.setIgst(ParseUtil.parseBigDecimal(line.getIgst()));
                receipt.setIsActive(true);
                receipt.setIsDeleted(false);

                if (isNewLine) receipt.setCreatedAt(LocalDateTime.now());
                else           receipt.setUpdatedAt(LocalDateTime.now());

                kept.add(receiptRepository.save(receipt).getReceiptId());
            }
        }

        // Lines removed in the UI → soft delete
        existing.values().stream()
                .filter(r -> !kept.contains(r.getReceiptId()))
                .forEach(r -> {
                    r.setIsDeleted(true);
                    r.setIsActive(false);
                    r.setDeletedAt(LocalDateTime.now());
                    receiptRepository.save(r);
                });

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
                    // Only findAllReceiptSummary returns inward_type (column 12)
                    res.setInwardType(row.length > 12 && row[12] != null
                            ? ParseUtil.toString(row[12]) : "BYPO");
                    // ...and supplier_name (column 13)
                    res.setSupplierName(row.length > 13
                            ? ParseUtil.toString(row[13]) : null);
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
        
     // Job inwards keep their number in job_grn_no; the form shows both as "GRN No."
        request.setGrnNo("JOBINWARD".equals(det.getInwardType())
                ? (det.getJobGrnNo() != null ? String.valueOf(det.getJobGrnNo()) : null)
                : det.getGrnNo());
        
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
        
        request.setActualDateTimeOfReceipt(
                det.getActualReceiptDateTime() != null
                ? det.getActualReceiptDateTime().toString() : null);
        request.setInwardType(det.getInwardType() != null ? det.getInwardType() : "BYPO");
        request.setReceiptDetId(det.getReceiptDetId());


        // ── Lines — from sos_material_receipt_t ──────────────────────────────
        List<SosMaterialReceipt> receiptLines = receiptRepository
                .findAllByReceiptMainIdAndIsDeletedFalse(
                        det.getReceiptDetId());

        List<SosMaterialReceiptLineRequest> lines = receiptLines.stream()
                .map(line -> {
                	
                    SosMaterialReceiptLineRequest lineReq =
                            new SosMaterialReceiptLineRequest();
                    lineReq.setReceiptId(line.getReceiptId() != null
                            ? String.valueOf(line.getReceiptId()) : null);

                    // Job-inward lines have no PO line — material comes from the receipt row
                    if (line.getPoDetId() == null && line.getMaterialId() != null) {
                        lineReq.setPoRmCode(String.valueOf(line.getMaterialId()));
                        List<Object[]> nameUom = "PACKING_MATERIAL".equals(line.getMaterialType())
                                ? receiptRepository.findPmNameAndUom(line.getMaterialId())
                                : receiptRepository.findRmNameAndUom(line.getMaterialId());
                        if (!nameUom.isEmpty()) {
                            lineReq.setPoRmName(ParseUtil.toString(nameUom.get(0)[0]));
                            lineReq.setPoUom(ParseUtil.toString(nameUom.get(0)[1]));
                        }
                    }

                    lineReq.setPoDetId(line.getPoDetId() != null
                            ? String.valueOf(line.getPoDetId()) : null);
                    lineReq.setRmReceivedQty(line.getQty() != null
                            ? line.getQty().toPlainString() : null);
                    lineReq.setReceivedRate(line.getPerUnitRate() != null
                            ? line.getPerUnitRate().toPlainString() : null);
                    lineReq.setLotNumber(line.getLotNo());
                    // Line-level GST (job inward); PO lines are overridden from the PO line below
                    lineReq.setSgst(line.getSgst() != null ? line.getSgst().toPlainString() : null);
                    lineReq.setCgst(line.getCgst() != null ? line.getCgst().toPlainString() : null);
                    lineReq.setIgst(line.getIgst() != null ? line.getIgst().toPlainString() : null);
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