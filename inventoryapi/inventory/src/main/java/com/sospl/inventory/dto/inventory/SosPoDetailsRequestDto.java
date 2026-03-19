package com.sospl.inventory.dto.inventory;

import java.math.BigDecimal;

public class SosPoDetailsRequestDto {

    private Long poDetId;           // null for new line items, set for existing ones
    private String poRmCode;
    private String poRmName;
    private BigDecimal poQty;
    private BigDecimal poRate;
    private String poUom;
    private BigDecimal sgst;
    private BigDecimal cgst;
    private BigDecimal igst;
    private BigDecimal poNoOfPacks;
    private BigDecimal poPackSize;
    private String hsnCode;         // JSON uses "hsnCode", entity uses "hSnCode"

    // Getters and Setters

    public Long getPoDetId() { return poDetId; }
    public void setPoDetId(Long poDetId) { this.poDetId = poDetId; }

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

    public BigDecimal getCgst() { return cgst; }
    public void setCgst(BigDecimal cgst) { this.cgst = cgst; }

    public BigDecimal getIgst() { return igst; }
    public void setIgst(BigDecimal igst) { this.igst = igst; }

    public BigDecimal getPoNoOfPacks() { return poNoOfPacks; }
    public void setPoNoOfPacks(BigDecimal poNoOfPacks) { this.poNoOfPacks = poNoOfPacks; }

    public BigDecimal getPoPackSize() { return poPackSize; }
    public void setPoPackSize(BigDecimal poPackSize) { this.poPackSize = poPackSize; }

    public String getHsnCode() { return hsnCode; }
    public void setHsnCode(String hsnCode) { this.hsnCode = hsnCode; }
}