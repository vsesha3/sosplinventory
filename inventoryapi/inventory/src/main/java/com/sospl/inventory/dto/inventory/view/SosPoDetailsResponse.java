package com.sospl.inventory.dto.inventory.view;

import java.math.BigDecimal;

public class SosPoDetailsResponse {

    private Long poDetId;
    private Long poRefNo;
    private String poRmCode;
    private String poRmName;
    private BigDecimal poQty;
    private BigDecimal poRate;
    private String poUom;
    private BigDecimal sgst;
    private BigDecimal sgstValue;
    private BigDecimal cgst;
    private BigDecimal cgstValue;
    private BigDecimal igst;
    private BigDecimal igstValue;
    private BigDecimal poNoOfPacks;
    private BigDecimal poPackSize;
    private String hSnCode;
    private Boolean isActive;
    
 // ── From sos_po_receipt_t ─────────────────────────────────────────────
    private BigDecimal rmReceivedQty;
    private String inspectedBy;
    private String approvedBy;
    private String lotNumber;
    private String expDateDel;
    private String actDateDel;
    private Long poReceiptNo;
    private String freight;
    private BigDecimal rmRcvdQty;
    
    public BigDecimal getRmRcvdQty() {
		return rmRcvdQty;
	}
	public void setRmRcvdQty(BigDecimal rmRcvdQty) {
		this.rmRcvdQty = rmRcvdQty;
	}
	public String getFreight() {
		return freight;
	}
	public void setFreight(String freight) {
		this.freight = freight;
	}
	public String gethSnCode() {
		return hSnCode;
	}
	public void sethSnCode(String hSnCode) {
		this.hSnCode = hSnCode;
	}
	public BigDecimal getRmReceivedQty() {
		return rmReceivedQty;
	}
	public void setRmReceivedQty(BigDecimal rmReceivedQty) {
		this.rmReceivedQty = rmReceivedQty;
	}
	public String getInspectedBy() {
		return inspectedBy;
	}
	public void setInspectedBy(String inspectedBy) {
		this.inspectedBy = inspectedBy;
	}
	public String getApprovedBy() {
		return approvedBy;
	}
	public void setApprovedBy(String approvedBy) {
		this.approvedBy = approvedBy;
	}
	public String getLotNumber() {
		return lotNumber;
	}
	public void setLotNumber(String lotNumber) {
		this.lotNumber = lotNumber;
	}
	public String getExpDateDel() {
		return expDateDel;
	}
	public void setExpDateDel(String expDateDel) {
		this.expDateDel = expDateDel;
	}
	public String getActDateDel() {
		return actDateDel;
	}
	public void setActDateDel(String actDateDel) {
		this.actDateDel = actDateDel;
	}
	public Long getPoReceiptNo() {
		return poReceiptNo;
	}
	public void setPoReceiptNo(Long poReceiptNo) {
		this.poReceiptNo = poReceiptNo;
	}
	// Getters
    public Long getPoDetId() { return poDetId; }
    public Long getPoRefNo() { return poRefNo; }
    public String getPoRmCode() { return poRmCode; }
    public String getPoRmName() { return poRmName; }
    public BigDecimal getPoQty() { return poQty; }
    public BigDecimal getPoRate() { return poRate; }
    public String getPoUom() { return poUom; }
    public BigDecimal getSgst() { return sgst; }
    public BigDecimal getSgstValue() { return sgstValue; }
    public BigDecimal getCgst() { return cgst; }
    public BigDecimal getCgstValue() { return cgstValue; }
    public BigDecimal getIgst() { return igst; }
    public BigDecimal getIgstValue() { return igstValue; }
    public BigDecimal getPoNoOfPacks() { return poNoOfPacks; }
    public BigDecimal getPoPackSize() { return poPackSize; }
    public String getHSnCode() { return hSnCode; }
    public Boolean getIsActive() { return isActive; }

    // Setters
    public void setPoDetId(Long poDetId) { this.poDetId = poDetId; }
    public void setPoRefNo(Long poRefNo) { this.poRefNo = poRefNo; }
    public void setPoRmCode(String poRmCode) { this.poRmCode = poRmCode; }
    public void setPoRmName(String poRmName) { this.poRmName = poRmName; }
    public void setPoQty(BigDecimal poQty) { this.poQty = poQty; }
    public void setPoRate(BigDecimal poRate) { this.poRate = poRate; }
    public void setPoUom(String poUom) { this.poUom = poUom; }
    public void setSgst(BigDecimal sgst) { this.sgst = sgst; }
    public void setSgstValue(BigDecimal sgstValue) { this.sgstValue = sgstValue; }
    public void setCgst(BigDecimal cgst) { this.cgst = cgst; }
    public void setCgstValue(BigDecimal cgstValue) { this.cgstValue = cgstValue; }
    public void setIgst(BigDecimal igst) { this.igst = igst; }
    public void setIgstValue(BigDecimal igstValue) { this.igstValue = igstValue; }
    public void setPoNoOfPacks(BigDecimal poNoOfPacks) { this.poNoOfPacks = poNoOfPacks; }
    public void setPoPackSize(BigDecimal poPackSize) { this.poPackSize = poPackSize; }
    public void setHSnCode(String hSnCode) { this.hSnCode = hSnCode; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}