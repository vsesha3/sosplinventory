
package com.sospl.inventory.model.rmrequest;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "sos_rm_request_view")
public class SosRmRequestView {

    @Id
    @Column(name = "rm_req_id")
    private Long rmReqId;

    @Column(name = "production_lot_number")
    private String productionLotNumber;

    @Column(name = "rm_req_date")
    private LocalDate rmReqDate;

    @Column(name = "schedule_date")
    private LocalDate scheduleDate;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "wo_code")
    private String woCode;

    @Column(name = "plan_to_prod_qty")
    private BigDecimal planToProdQty;

    @Column(name = "request_by")
    private String  requestBy;

    @Column(name = "gin_no")
    private String ginNo;

    @Column(name = "requested_by_name")
    private String requestedByName;
    
    public BigDecimal getPendingRM() {
		return pendingRM;
	}

	public void setPendingRM(BigDecimal pendingRM) {
		this.pendingRM = pendingRM;
	}

	public BigDecimal getPendingPM() {
		return pendingPM;
	}

	public void setPendingPM(BigDecimal pendingPM) {
		this.pendingPM = pendingPM;
	}

	@Transient
    private BigDecimal pendingRM;
    
    @Transient
    private BigDecimal pendingPM;
    
    @Transient
    private BigDecimal totalRM;
    @Transient
    private  BigDecimal totalPM;

    public BigDecimal getTotalRM() {
		return totalRM;
	}

	public void setTotalRM(BigDecimal totalRM) {
		this.totalRM = totalRM;
	}

	public BigDecimal getTotalPm() {
		return totalPM;
	}

	public void setTotalPm(BigDecimal totalPm) {
		this.totalPM = totalPm;
	}

	public String getRequestedByName() {
        return requestedByName;
    }

    public void setRequestedByName(String requestedByName) {
        this.requestedByName = requestedByName;
    }

    public Long getRmReqId() {
        return rmReqId;
    }

    public void setRmReqId(Long rmReqId) {
        this.rmReqId = rmReqId;
    }

    public String getProductionLotNumber() {
        return productionLotNumber;
    }

    public void setProductionLotNumber(String productionLotNumber) {
        this.productionLotNumber = productionLotNumber;
    }

    public LocalDate getRmReqDate() {
        return rmReqDate;
    }

    public void setRmReqDate(LocalDate rmReqDate) {
        this.rmReqDate = rmReqDate;
    }

    public LocalDate getScheduleDate() {
        return scheduleDate;
    }

    public void setScheduleDate(LocalDate scheduleDate) {
        this.scheduleDate = scheduleDate;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getWoCode() {
        return woCode;
    }

    public void setWoCode(String woCode) {
        this.woCode = woCode;
    }

    public BigDecimal getPlanToProdQty() {
        return planToProdQty;
    }

    public void setPlanToProdQty(BigDecimal planToProdQty) {
        this.planToProdQty = planToProdQty;
    }

    public String getRequestBy() {
        return requestBy;
    }

    public void setRequestBy(String requestBy) {
        this.requestBy = requestBy;
    }

    public String getGinNo() {
        return ginNo;
    }

    public void setGinNo(String ginNo) {
        this.ginNo = ginNo;
    }
}
