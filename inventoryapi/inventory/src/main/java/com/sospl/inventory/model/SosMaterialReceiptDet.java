package com.sospl.inventory.model;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "sos_material_receipt_det_t")
public class SosMaterialReceiptDet extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "receipt_det_id")
    private Long receiptDetId;

    @Column(name = "material_type", length = 20)
    private String materialType;

    @Column(name = "invoice_no", length = 100)
    private String invoiceNo;

    @Column(name = "warehouse", length = 100)
    private String warehouse;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "sap_po", length = 250)
    private String sapPo;

    @Column(name = "transporter_detls", length = 500)
    private String transporterDetls;

    @Column(name = "transporter_id")
    private Long transporterId;

    @Column(name = "freight_rs", precision = 11, scale = 2)
    private BigDecimal freightRs;

    @Column(name = "freight_value", precision = 11, scale = 2)
    private BigDecimal freightValue;

    @Column(name = "hamali_charges_rs", precision = 11, scale = 2)
    private BigDecimal hamaliChargesRs;

    @Column(name = "vehicle_in")
    private LocalDate vehicleIn;

    @Column(name = "vehicle_out")
    private LocalDate vehicleOut;

    @Column(name = "unloading_by", length = 250)
    private String unloadingBy;

    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "name_of_transported", length = 250)
    private String nameOfTransported;

    @Column(name = "truck_model", length = 250)
    private String truckModel;

    @Column(name = "modvat_copy_record")
    private Boolean modvatCopyRecord;

    @Column(name = "modvat_copy_no", length = 250)
    private String modvatCopyNo;

    @Column(name = "grn_no", length = 250)
    private String grnNo;

    @Column(name = "irc_no", length = 250)
    private String ircNo;

    @Column(name = "addition_ass_value", precision = 11, scale = 2)
    private BigDecimal additionAssValue;

    @Column(name = "discount", precision = 5, scale = 2)
    private BigDecimal discount;

    @Column(name = "discount_value", precision = 11, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "cenvat", precision = 5, scale = 2)
    private BigDecimal cenvat;

    @Column(name = "cenvat_value", precision = 11, scale = 2)
    private BigDecimal cenvatValue;

    @Column(name = "addition_duty", precision = 5, scale = 2)
    private BigDecimal additionDuty;

    @Column(name = "a_d_i_value", precision = 11, scale = 2)
    private BigDecimal aDiValue;

    @Column(name = "e_cess", precision = 5, scale = 2)
    private BigDecimal eCess;

    @Column(name = "e_cess_value", precision = 11, scale = 2)
    private BigDecimal eCessValue;

    @Column(name = "sh_e_cess", precision = 5, scale = 2)
    private BigDecimal shECess;

    @Column(name = "sh_e_cess_value", precision = 11, scale = 2)
    private BigDecimal shECessValue;

    @Column(name = "c_s_t", precision = 5, scale = 2)
    private BigDecimal cSt;

    @Column(name = "c_s_t_value", precision = 11, scale = 2)
    private BigDecimal cStValue;

    @Column(name = "l_s_t", precision = 5, scale = 2)
    private BigDecimal lSt;

    @Column(name = "l_s_t_value", precision = 11, scale = 2)
    private BigDecimal lStValue;

    @Column(name = "others", precision = 11, scale = 2)
    private BigDecimal others;

    @Column(name = "igst", precision = 11, scale = 2)
    private BigDecimal igst;

    @Column(name = "igst_value", precision = 11, scale = 2)
    private BigDecimal igstValue;

    @Column(name = "cgst", precision = 11, scale = 2)
    private BigDecimal cgst;

    @Column(name = "cgst_value", precision = 11, scale = 2)
    private BigDecimal cgstValue;

    @Column(name = "sgst", precision = 11, scale = 2)
    private BigDecimal sgst;

    @Column(name = "sgst_value", precision = 11, scale = 2)
    private BigDecimal sgstValue;

    @Column(name = "invoice_date")
    private LocalDate invoiceDate;

    @Column(name = "div_no")
    private Long divNo;

    @Column(name = "received_by", length = 100)
    private String receivedBy;

    @Column(name = "driver_name", length = 250)
    private String driverName;

    @Column(name = "receipt_date_time")
    private LocalDateTime receiptDateTime;

    @Column(name = "actual_receipt_date_time")
    private LocalDate actualReceiptDateTime;

    @Column(name = "lr_number", length = 250)
    private String lrNumber;

    @Column(name = "storage_location", length = 250)
    private String storageLocation;

    @Column(name = "another_doc_rec", length = 250)
    private String anotherDocRec;

    @Column(name = "from_record")
    private Boolean fromRecord;

    @Column(name = "excise_complete")
    private Boolean exciseComplete;

    @Column(name = "remark", length = 250)
    private String remark;
    
    @Column(name = "po_ref_no",length=250)
    private int poRefNo;
    
   
    // ── Getters ───────────────────────────────────────────────────────────

    public Long getReceiptDetId() { return receiptDetId; }
    public String getMaterialType() { return materialType; }
    public String getInvoiceNo() { return invoiceNo; }
    public String getWarehouse() { return warehouse; }
    public String getDescription() { return description; }
    public String getSapPo() { return sapPo; }
    public String getTransporterDetls() { return transporterDetls; }
    public Long getTransporterId() { return transporterId; }
    public BigDecimal getFreightRs() { return freightRs; }
    public BigDecimal getFreightValue() { return freightValue; }
    public BigDecimal getHamaliChargesRs() { return hamaliChargesRs; }
    public LocalDate getVehicleIn() { return vehicleIn; }
    public LocalDate getVehicleOut() { return vehicleOut; }
    public String getUnloadingBy() { return unloadingBy; }
    public Long getSupplierId() { return supplierId; }
    public Long getCompanyId() { return companyId; }
    public String getNameOfTransported() { return nameOfTransported; }
    public String getTruckModel() { return truckModel; }
    public Boolean getModvatCopyRecord() { return modvatCopyRecord; }
    public String getModvatCopyNo() { return modvatCopyNo; }
    public String getGrnNo() { return grnNo; }
    public String getIrcNo() { return ircNo; }
    public BigDecimal getAdditionAssValue() { return additionAssValue; }
    public BigDecimal getDiscount() { return discount; }
    public BigDecimal getDiscountValue() { return discountValue; }
    public BigDecimal getCenvat() { return cenvat; }
    public BigDecimal getCenvatValue() { return cenvatValue; }
    public BigDecimal getAdditionDuty() { return additionDuty; }
    public BigDecimal getADiValue() { return aDiValue; }
    public BigDecimal getECess() { return eCess; }
    public BigDecimal getECessValue() { return eCessValue; }
    public BigDecimal getShECess() { return shECess; }
    public BigDecimal getShECessValue() { return shECessValue; }
    public BigDecimal getCSt() { return cSt; }
    public BigDecimal getCStValue() { return cStValue; }
    public BigDecimal getLSt() { return lSt; }
    public BigDecimal getLStValue() { return lStValue; }
    public BigDecimal getOthers() { return others; }
    public BigDecimal getIgst() { return igst; }
    public BigDecimal getIgstValue() { return igstValue; }
    public BigDecimal getCgst() { return cgst; }
    public BigDecimal getCgstValue() { return cgstValue; }
    public BigDecimal getSgst() { return sgst; }
    public BigDecimal getSgstValue() { return sgstValue; }
    public LocalDate getInvoiceDate() { return invoiceDate; }
    public Long getDivNo() { return divNo; }
    public String getReceivedBy() { return receivedBy; }
    public String getDriverName() { return driverName; }
    public LocalDateTime getReceiptDateTime() { return receiptDateTime; }
    public LocalDate getActualReceiptDateTime() { return actualReceiptDateTime; }
    public String getLrNumber() { return lrNumber; }
    public String getStorageLocation() { return storageLocation; }
    public String getAnotherDocRec() { return anotherDocRec; }
    public Boolean getFromRecord() { return fromRecord; }
    public Boolean getExciseComplete() { return exciseComplete; }
    public String getRemark() { return remark; }
    

    // ── Setters ───────────────────────────────────────────────────────────

    public int getPoRefNo() {
		return poRefNo;
	}
	public void setPoRefNo(int poRefNo) {
		this.poRefNo = poRefNo;
	}
	public void setReceiptDetId(Long receiptDetId) { this.receiptDetId = receiptDetId; }
    public void setMaterialType(String materialType) { this.materialType = materialType; }
    public void setInvoiceNo(String invoiceNo) { this.invoiceNo = invoiceNo; }
    public void setWarehouse(String warehouse) { this.warehouse = warehouse; }
    public void setDescription(String description) { this.description = description; }
    public void setSapPo(String sapPo) { this.sapPo = sapPo; }
    public void setTransporterDetls(String transporterDetls) { this.transporterDetls = transporterDetls; }
    public void setTransporterId(Long transporterId) { this.transporterId = transporterId; }
    public void setFreightRs(BigDecimal freightRs) { this.freightRs = freightRs; }
    public void setFreightValue(BigDecimal freightValue) { this.freightValue = freightValue; }
    public void setHamaliChargesRs(BigDecimal hamaliChargesRs) { this.hamaliChargesRs = hamaliChargesRs; }
    public void setVehicleIn(LocalDate vehicleIn) { this.vehicleIn = vehicleIn; }
    public void setVehicleOut(LocalDate vehicleOut) { this.vehicleOut = vehicleOut; }
    public void setUnloadingBy(String unloadingBy) { this.unloadingBy = unloadingBy; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public void setNameOfTransported(String nameOfTransported) { this.nameOfTransported = nameOfTransported; }
    public void setTruckModel(String truckModel) { this.truckModel = truckModel; }
    public void setModvatCopyRecord(Boolean modvatCopyRecord) { this.modvatCopyRecord = modvatCopyRecord; }
    public void setModvatCopyNo(String modvatCopyNo) { this.modvatCopyNo = modvatCopyNo; }
    public void setGrnNo(String grnNo) { this.grnNo = grnNo; }
    public void setIrcNo(String ircNo) { this.ircNo = ircNo; }
    public void setAdditionAssValue(BigDecimal additionAssValue) { this.additionAssValue = additionAssValue; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }
    public void setCenvat(BigDecimal cenvat) { this.cenvat = cenvat; }
    public void setCenvatValue(BigDecimal cenvatValue) { this.cenvatValue = cenvatValue; }
    public void setAdditionDuty(BigDecimal additionDuty) { this.additionDuty = additionDuty; }
    public void setADiValue(BigDecimal aDiValue) { this.aDiValue = aDiValue; }
    public void setECess(BigDecimal eCess) { this.eCess = eCess; }
    public void setECessValue(BigDecimal eCessValue) { this.eCessValue = eCessValue; }
    public void setShECess(BigDecimal shECess) { this.shECess = shECess; }
    public void setShECessValue(BigDecimal shECessValue) { this.shECessValue = shECessValue; }
    public void setCSt(BigDecimal cSt) { this.cSt = cSt; }
    public void setCStValue(BigDecimal cStValue) { this.cStValue = cStValue; }
    public void setLSt(BigDecimal lSt) { this.lSt = lSt; }
    public void setLStValue(BigDecimal lStValue) { this.lStValue = lStValue; }
    public void setOthers(BigDecimal others) { this.others = others; }
    public void setIgst(BigDecimal igst) { this.igst = igst; }
    public void setIgstValue(BigDecimal igstValue) { this.igstValue = igstValue; }
    public void setCgst(BigDecimal cgst) { this.cgst = cgst; }
    public void setCgstValue(BigDecimal cgstValue) { this.cgstValue = cgstValue; }
    public void setSgst(BigDecimal sgst) { this.sgst = sgst; }
    public void setSgstValue(BigDecimal sgstValue) { this.sgstValue = sgstValue; }
    public void setInvoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; }
    public void setDivNo(Long divNo) { this.divNo = divNo; }
    public void setReceivedBy(String receivedBy) { this.receivedBy = receivedBy; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public void setReceiptDateTime(LocalDateTime receiptDateTime) { this.receiptDateTime = receiptDateTime; }
    public void setActualReceiptDateTime(LocalDate actualReceiptDateTime) { this.actualReceiptDateTime = actualReceiptDateTime; }
    public void setLrNumber(String lrNumber) { this.lrNumber = lrNumber; }
    public void setStorageLocation(String storageLocation) { this.storageLocation = storageLocation; }
    public void setAnotherDocRec(String anotherDocRec) { this.anotherDocRec = anotherDocRec; }
    public void setFromRecord(Boolean fromRecord) { this.fromRecord = fromRecord; }
    public void setExciseComplete(Boolean exciseComplete) { this.exciseComplete = exciseComplete; }
    public void setRemark(String remark) { this.remark = remark; }
}