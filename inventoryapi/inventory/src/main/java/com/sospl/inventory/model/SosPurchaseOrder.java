package com.sospl.inventory.model;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "sos_purchase_order_t")
public class SosPurchaseOrder extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "po_id")
    private Long poId;

    @Column(name = "po_number", length = 25)
    private String poNumber;

    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "ord_date")
    private LocalDateTime ordDate;

    @Column(name = "ord_delivery_date")
    private LocalDateTime ordDeliveryDate;

    @Column(name = "partial_po_flag",
            columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean partialPoFlag;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getPoId() { return poId; }
    public String getPoNumber() { return poNumber; }
    public Long getCompanyId() { return companyId; }
    public LocalDateTime getOrdDate() { return ordDate; }
    public LocalDateTime getOrdDeliveryDate() { return ordDeliveryDate; }
    public Boolean getPartialPoFlag() { return partialPoFlag; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setPoId(Long poId) { this.poId = poId; }
    public void setPoNumber(String poNumber) { this.poNumber = poNumber; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public void setOrdDate(LocalDateTime ordDate) { this.ordDate = ordDate; }
    public void setOrdDeliveryDate(LocalDateTime ordDeliveryDate) { this.ordDeliveryDate = ordDeliveryDate; }
    public void setPartialPoFlag(Boolean partialPoFlag) { this.partialPoFlag = partialPoFlag; }
}