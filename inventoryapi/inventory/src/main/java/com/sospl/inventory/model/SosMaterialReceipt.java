package com.sospl.inventory.model;

import java.io.File;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.sospl.inventory.model.common.BaseAuditEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "sos_material_receipt_t")
public class SosMaterialReceipt extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "receipt_id")
    private Long receiptId;

    @Column(name = "material_type", length = 20)
    private String materialType;

    @Column(name = "material_id")
    private Long materialId;

    @Column(name = "no_of_received")
    private Integer noOfReceived;

    @Column(name = "pack_size")
    private Integer packSize;

    @Column(name = "no_of_damaged")
    private Integer noOfDamaged;

    @Column(name = "shortage_kgs", precision = 11, scale = 2)
    private BigDecimal shortageKgs;

    @Column(name = "physical_loss", precision = 11, scale = 2)
    private BigDecimal physicalLoss;

    @Column(name = "qty", precision = 11, scale = 2)
    private BigDecimal qty;

    @Column(name = "per_unit_rate", precision = 11, scale = 2)
    private BigDecimal perUnitRate;

    @Column(name = "receipt_main_id")
    private Long receiptMainId;

    @Column(name = "is_fg", columnDefinition = "TINYINT(1)")
    private Boolean isFg;

    @Column(name = "rm_req_id")
    private Long rmReqId;

    @Column(name = "shelf_life_time", length = 100)
    private String shelfLifeTime;

    @Column(name = "pm_account_type_id")
    private Long pmAccountTypeId;

    @Column(name = "dom")
    private LocalDate dom;

    @Column(name = "freight_rs", precision = 11, scale = 2)
    private BigDecimal freightRs;

    @Column(name = "lot_no", length = 100)
    private String lotNo;

    @Column(name = "old_pack_weight")
    private Integer oldPackWeight;

    @Column(name = "pack_type", length = 250)
    private String packType;

    @Column(name = "pack_weight", precision = 11, scale = 2)
    private BigDecimal packWeight;

    @Column(name = "po_det_id")
    private Long poDetId;

    @Column(name = "po_ref_no")
    private Long poRefNo;
    
    @Column(name = "receipt_det_id")
    private Long receiptDetId;

    // ── Getters ───────────────────────────────────────────────────────────

    public Long getReceiptDetId() {
		return receiptDetId;
	}
	public void setReceiptDetId(Long receiptDetId) {
		this.receiptDetId = receiptDetId;
	}
	public Long getReceiptId() { return receiptId; }
    public String getMaterialType() { return materialType; }
    public Long getMaterialId() { return materialId; }
    public Integer getNoOfReceived() { return noOfReceived; }
    public Integer getPackSize() { return packSize; }
    public Integer getNoOfDamaged() { return noOfDamaged; }
    public BigDecimal getShortageKgs() { return shortageKgs; }
    public BigDecimal getPhysicalLoss() { return physicalLoss; }
    public BigDecimal getQty() { return qty; }
    public BigDecimal getPerUnitRate() { return perUnitRate; }
    public Long getReceiptMainId() { return receiptMainId; }
    public Boolean getIsFg() { return isFg; }
    public Long getRmReqId() { return rmReqId; }
    public String getShelfLifeTime() { return shelfLifeTime; }
    public Long getPmAccountTypeId() { return pmAccountTypeId; }
    public LocalDate getDom() { return dom; }
    public BigDecimal getFreightRs() { return freightRs; }
    public String getLotNo() { return lotNo; }
    public Integer getOldPackWeight() { return oldPackWeight; }
    public String getPackType() { return packType; }
    public BigDecimal getPackWeight() { return packWeight; }
    public Long getPoDetId() { return poDetId; }
    public Long getPoRefNo() { return poRefNo; }

    // ── Setters ───────────────────────────────────────────────────────────

    public void setReceiptId(Long receiptId) { this.receiptId = receiptId; }
    public void setMaterialType(String materialType) { this.materialType = materialType; }
    public void setMaterialId(Long materialId) { this.materialId = materialId; }
    public void setNoOfReceived(Integer noOfReceived) { this.noOfReceived = noOfReceived; }
    public void setPackSize(Integer packSize) { this.packSize = packSize; }
    public void setNoOfDamaged(Integer noOfDamaged) { this.noOfDamaged = noOfDamaged; }
    public void setShortageKgs(BigDecimal shortageKgs) { this.shortageKgs = shortageKgs; }
    public void setPhysicalLoss(BigDecimal physicalLoss) { this.physicalLoss = physicalLoss; }
    public void setQty(BigDecimal qty) { this.qty = qty; }
    public void setPerUnitRate(BigDecimal perUnitRate) { this.perUnitRate = perUnitRate; }
    public void setReceiptMainId(Long receiptMainId) { this.receiptMainId = receiptMainId; }
    public void setIsFg(Boolean isFg) { this.isFg = isFg; }
    public void setRmReqId(Long rmReqId) { this.rmReqId = rmReqId; }
    public void setShelfLifeTime(String shelfLifeTime) { this.shelfLifeTime = shelfLifeTime; }
    public void setPmAccountTypeId(Long pmAccountTypeId) { this.pmAccountTypeId = pmAccountTypeId; }
    public void setDom(LocalDate dom) { this.dom = dom; }
    public void setFreightRs(BigDecimal freightRs) { this.freightRs = freightRs; }
    public void setLotNo(String lotNo) { this.lotNo = lotNo; }
    public void setOldPackWeight(Integer oldPackWeight) { this.oldPackWeight = oldPackWeight; }
    public void setPackType(String packType) { this.packType = packType; }
    public void setPackWeight(BigDecimal packWeight) { this.packWeight = packWeight; }
    public void setPoDetId(Long poDetId) { this.poDetId = poDetId; }
    public void setPoRefNo(Long poRefNo) { this.poRefNo = poRefNo; }
}
