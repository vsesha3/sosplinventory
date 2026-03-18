package com.sospl.inventory.dto.inventory.view;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SosPurchaseOrderRequest {

    private String poDate;                  // "2026-03-18"
    private String poType;
    private String poNo;
    private String poKindAttention;
    private Long supplierId;
    private String poDeliverySchedule;
    private String poPaymentTerms;
    private String poDeliveryTerms;
    private String poReference;
    private String poRemarks;
    private BigDecimal addCharges;
    private String requestedBy;

    public String getPoDate() { return poDate; }
    public void setPoDate(String poDate) { this.poDate = poDate; }

    public String getPoType() { return poType; }
    public void setPoType(String poType) { this.poType = poType; }

    public String getPoNo() { return poNo; }
    public void setPoNo(String poNo) { this.poNo = poNo; }

    public String getPoKindAttention() { return poKindAttention; }
    public void setPoKindAttention(String poKindAttention) { this.poKindAttention = poKindAttention; }

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

    public String getPoDeliverySchedule() { return poDeliverySchedule; }
    public void setPoDeliverySchedule(String poDeliverySchedule) { this.poDeliverySchedule = poDeliverySchedule; }

    public String getPoPaymentTerms() { return poPaymentTerms; }
    public void setPoPaymentTerms(String poPaymentTerms) { this.poPaymentTerms = poPaymentTerms; }

    public String getPoDeliveryTerms() { return poDeliveryTerms; }
    public void setPoDeliveryTerms(String poDeliveryTerms) { this.poDeliveryTerms = poDeliveryTerms; }

    public String getPoReference() { return poReference; }
    public void setPoReference(String poReference) { this.poReference = poReference; }

    public String getPoRemarks() { return poRemarks; }
    public void setPoRemarks(String poRemarks) { this.poRemarks = poRemarks; }

    public BigDecimal getAddCharges() { return addCharges; }
    public void setAddCharges(BigDecimal addCharges) { this.addCharges = addCharges; }

    public String getRequestedBy() { return requestedBy; }
    public void setRequestedBy(String requestedBy) { this.requestedBy = requestedBy; }
}