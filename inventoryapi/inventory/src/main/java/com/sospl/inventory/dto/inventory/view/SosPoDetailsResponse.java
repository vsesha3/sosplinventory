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
    private BigDecimal poNoOfPacks;
    private BigDecimal poPackSize;
    private BigDecimal cgst;
    private BigDecimal cgstValue;
    private BigDecimal igst;
    private BigDecimal igstValue;
    private String hSnCode;

    public Long getPoDetId() { return poDetId; }
    public void setPoDetId(Long poDetId) { this.poDetId = poDetId; }

    public Long getPoRefNo() { return poRefNo; }
    public void setPoRefNo(Long poRefNo) { this.poRefNo = poRefNo; }

    public String getPoRmCode() { return poRmCode; }
    public void setPoRmCode(String poRmCode) { this.poRmCode = poRmCode; }

    public String getPoRmName() { return poRmName; }
    public void setPoRmName(String poRmName) { this.poRmName = poRmName; }

    public BigDecimal getPoQty() { return poQty; }
    public void setPoQty(BigDecimal poQty) { this.poQty = poQty; }

    public BigDecimal getPoRate() { return poRate; }
    public void setPoRate(BigDecimal poRate) { this.poRate = poRate; }

    public String getPoUom() { return poUom; }
    public void setPoUom(String poUom) { this.poUom = poUom; }

    public BigDecimal getSgst() { return sgst; }
    public void setSgst(BigDecimal sgst) { this.sgst = sgst; }

    public BigDecimal getSgstValue() { return sgstValue; }
    public void setSgstValue(BigDecimal sgstValue) { this.sgstValue = sgstValue; }

    public BigDecimal getPoNoOfPacks() { return poNoOfPacks; }
    public void setPoNoOfPacks(BigDecimal poNoOfPacks) { this.poNoOfPacks = poNoOfPacks; }

    public BigDecimal getPoPackSize() { return poPackSize; }
    public void setPoPackSize(BigDecimal poPackSize) { this.poPackSize = poPackSize; }

    public BigDecimal getCgst() { return cgst; }
    public void setCgst(BigDecimal cgst) { this.cgst = cgst; }

    public BigDecimal getCgstValue() { return cgstValue; }
    public void setCgstValue(BigDecimal cgstValue) { this.cgstValue = cgstValue; }

    public BigDecimal getIgst() { return igst; }
    public void setIgst(BigDecimal igst) { this.igst = igst; }

    public BigDecimal getIgstValue() { return igstValue; }
    public void setIgstValue(BigDecimal igstValue) { this.igstValue = igstValue; }

    public String getHSnCode() { return hSnCode; }
    public void setHSnCode(String hSnCode) { this.hSnCode = hSnCode; }
}