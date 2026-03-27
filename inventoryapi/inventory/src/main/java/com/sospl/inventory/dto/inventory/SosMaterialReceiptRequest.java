package com.sospl.inventory.dto.inventory;

import java.util.List;

public class SosMaterialReceiptRequest {

    // ── Header fields → sos_material_receipt_det_t ───────────────────────
    private String actualDateTimeOfReceipt;
    private String dateTimeOfReceipt;
    private String grnNo;
    private String ircNo;
    private String supplierId;
    private String transporterId;
    private String stnCommercialInvoiceNo;
    private String invoiceDate;
    private String modvatCopyNo;
    private String sapPo;
    private String lrNumber;
    private String poRefNo;
    private String poDate;
    private String poType;

    // ── Line items → sos_material_receipt_t ──────────────────────────────
    private List<SosMaterialReceiptLineRequest> lines;

    // ── Getters and Setters ───────────────────────────────────────────────
    public String getActualDateTimeOfReceipt() { return actualDateTimeOfReceipt; }
    public void setActualDateTimeOfReceipt(String actualDateTimeOfReceipt) { this.actualDateTimeOfReceipt = actualDateTimeOfReceipt; }

    public String getDateTimeOfReceipt() { return dateTimeOfReceipt; }
    public void setDateTimeOfReceipt(String dateTimeOfReceipt) { this.dateTimeOfReceipt = dateTimeOfReceipt; }

    public String getGrnNo() { return grnNo; }
    public void setGrnNo(String grnNo) { this.grnNo = grnNo; }

    public String getIrcNo() { return ircNo; }
    public void setIrcNo(String ircNo) { this.ircNo = ircNo; }

    public String getSupplierId() { return supplierId; }
    public void setSupplierId(String supplierId) { this.supplierId = supplierId; }

    public String getTransporterId() { return transporterId; }
    public void setTransporterId(String transporterId) { this.transporterId = transporterId; }

    public String getStnCommercialInvoiceNo() { return stnCommercialInvoiceNo; }
    public void setStnCommercialInvoiceNo(String stnCommercialInvoiceNo) { this.stnCommercialInvoiceNo = stnCommercialInvoiceNo; }

    public String getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(String invoiceDate) { this.invoiceDate = invoiceDate; }

    public String getModvatCopyNo() { return modvatCopyNo; }
    public void setModvatCopyNo(String modvatCopyNo) { this.modvatCopyNo = modvatCopyNo; }

    public String getSapPo() { return sapPo; }
    public void setSapPo(String sapPo) { this.sapPo = sapPo; }

    public String getLrNumber() { return lrNumber; }
    public void setLrNumber(String lrNumber) { this.lrNumber = lrNumber; }

    public String getPoRefNo() { return poRefNo; }
    public void setPoRefNo(String poRefNo) { this.poRefNo = poRefNo; }

    public String getPoDate() { return poDate; }
    public void setPoDate(String poDate) { this.poDate = poDate; }

    public String getPoType() { return poType; }
    public void setPoType(String poType) { this.poType = poType; }

    public List<SosMaterialReceiptLineRequest> getLines() { return lines; }
    public void setLines(List<SosMaterialReceiptLineRequest> lines) { this.lines = lines; }
}