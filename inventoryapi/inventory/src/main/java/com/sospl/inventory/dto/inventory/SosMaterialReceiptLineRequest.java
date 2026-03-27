package com.sospl.inventory.dto.inventory;

public class SosMaterialReceiptLineRequest {

    private String poDetId;
    private String poRmCode;
    private String poRmName;
    private String poUom;
    private String rmOrderQty;
    private String rmReceivedQty;
    private String sgst;
    private String cgst;
    private String igst;
    private String receivedRate;
    private String expectedDeliveryDate;
    private String actualDeliveryDate;
    private String inspectedBy;
    private String approvedBy;
    private String lotNumber;

    // ── Getters and Setters ───────────────────────────────────────────────
    public String getPoDetId() { return poDetId; }
    public void setPoDetId(String poDetId) { this.poDetId = poDetId; }

    public String getPoRmCode() { return poRmCode; }
    public void setPoRmCode(String poRmCode) { this.poRmCode = poRmCode; }

    public String getPoRmName() { return poRmName; }
    public void setPoRmName(String poRmName) { this.poRmName = poRmName; }

    public String getPoUom() { return poUom; }
    public void setPoUom(String poUom) { this.poUom = poUom; }

    public String getRmOrderQty() { return rmOrderQty; }
    public void setRmOrderQty(String rmOrderQty) { this.rmOrderQty = rmOrderQty; }

    public String getRmReceivedQty() { return rmReceivedQty; }
    public void setRmReceivedQty(String rmReceivedQty) { this.rmReceivedQty = rmReceivedQty; }

    public String getSgst() { return sgst; }
    public void setSgst(String sgst) { this.sgst = sgst; }

    public String getCgst() { return cgst; }
    public void setCgst(String cgst) { this.cgst = cgst; }

    public String getIgst() { return igst; }
    public void setIgst(String igst) { this.igst = igst; }

    public String getReceivedRate() { return receivedRate; }
    public void setReceivedRate(String receivedRate) { this.receivedRate = receivedRate; }

    public String getExpectedDeliveryDate() { return expectedDeliveryDate; }
    public void setExpectedDeliveryDate(String expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; }

    public String getActualDeliveryDate() { return actualDeliveryDate; }
    public void setActualDeliveryDate(String actualDeliveryDate) { this.actualDeliveryDate = actualDeliveryDate; }

    public String getInspectedBy() { return inspectedBy; }
    public void setInspectedBy(String inspectedBy) { this.inspectedBy = inspectedBy; }

    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

    public String getLotNumber() { return lotNumber; }
    public void setLotNumber(String lotNumber) { this.lotNumber = lotNumber; }
}