package com.sospl.inventory.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_po_details_t")
public class SosPoDetails extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "po_det_id")
    private Long poDetId;

    @Column(name = "po_ref_no")
    private Long poRefNo;

    @Column(name = "po_rm_code")
    private String poRmCode;

    @Column(name = "po_rm_name")
    private String poRmName;

    @Column(name = "po_qty")
    private BigDecimal poQty;

    @Column(name = "po_rate")
    private BigDecimal poRate;

    @Column(name = "po_uom")
    private String poUom;

    @Column(name = "sgst")
    private BigDecimal sgst;

    @Column(name = "sgst_value")
    private BigDecimal sgstValue;

    @Column(name = "po_no_of_packs")
    private BigDecimal poNoOfPacks;

    @Column(name = "po_pack_size")
    private BigDecimal poPackSize;

    @Column(name = "cgst")
    private BigDecimal cgst;

    @Column(name = "cgst_value")
    private BigDecimal cgstValue;

    @Column(name = "igst")
    private BigDecimal igst;

    @Column(name = "igst_value")
    private BigDecimal igstValue;

    @Column(name = "h_s_n_code")
    private String hSnCode;

    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "receipt_det_id")
    private Long receiptDetId;

    public String gethSnCode() {
		return hSnCode;
	}
	public void sethSnCode(String hSnCode) {
		this.hSnCode = hSnCode;
	}
	public Long getReceiptDetId() {
		return receiptDetId;
	}
	public void setReceiptDetId(Long receiptDetId) {
		this.receiptDetId = receiptDetId;
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
    public BigDecimal getPoNoOfPacks() { return poNoOfPacks; }
    public BigDecimal getPoPackSize() { return poPackSize; }
    public BigDecimal getCgst() { return cgst; }
    public BigDecimal getCgstValue() { return cgstValue; }
    public BigDecimal getIgst() { return igst; }
    public BigDecimal getIgstValue() { return igstValue; }
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
    public void setPoNoOfPacks(BigDecimal poNoOfPacks) { this.poNoOfPacks = poNoOfPacks; }
    public void setPoPackSize(BigDecimal poPackSize) { this.poPackSize = poPackSize; }
    public void setCgst(BigDecimal cgst) { this.cgst = cgst; }
    public void setCgstValue(BigDecimal cgstValue) { this.cgstValue = cgstValue; }
    public void setIgst(BigDecimal igst) { this.igst = igst; }
    public void setIgstValue(BigDecimal igstValue) { this.igstValue = igstValue; }
    public void setHSnCode(String hSnCode) { this.hSnCode = hSnCode; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}