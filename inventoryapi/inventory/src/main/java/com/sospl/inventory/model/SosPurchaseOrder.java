package com.sospl.inventory.model;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import java.time.LocalDateTime;

import org.hibernate.annotations.Formula;

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
    
    @Column(name = "requested_by", length = 25)
    private String requestedBy;
    
    @Column(name = "inward_type", length = 20)
    private String inwardType;
    
    @Column(name = "partner_code", length = 20)
    private String partnerCode;
    
    @Formula("(SELECT m.misc_name FROM sos_misc_master_t m WHERE m.misc_id = company_id)")
    private String companyName;
    
    @Formula("(SELECT s.supplier_name FROM sos_supplier_master_t s WHERE s.supplier_id = partner_code)")
    private String partnerName;
    
    @Formula("""
    	    (SELECT e.employee_name
    	     FROM sospl_employee_data e
    	     WHERE e.employee_id = requested_by)
    	    """)
    	
	private String requestedByName;
    
    
   
	public String getRequestedBy() {
		return requestedBy;
	}
	public void setRequestedBy(String requestedBy) {
		this.requestedBy = requestedBy;
	}
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
    
    public String getInwardType() { return inwardType; }
    public void setInwardType(String inwardType) { this.inwardType = inwardType; }
    public String getPartnerCode() {return partnerCode;	}
	public void setPartnerCode(String partnerCode) {this.partnerCode = partnerCode;	}
	
	public String getCompanyName() { return companyName; }
	public String getPartnerName() { return partnerName; }
	public String getRequestedByName() { return requestedByName; }
	
}