package com.sospl.inventory.model;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "sos_work_order_t")
public class SosWorkOrder extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wo_id")
    private Long woId;

    @Column(name = "po_id")
    private Long poId;

    @Column(name = "plant", length = 25)
    private String plant;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "qty", precision = 11, scale = 2)
    private BigDecimal qty;

    @Column(name = "per_unit_rate", precision = 11, scale = 2)
    private BigDecimal perUnitRate;

    @Column(name = "wo_code", length = 250)
    private String woCode;

    @Column(name = "pm_id")
    private Long pmId;

    @Column(name = "line_item", length = 250)
    private String lineItem;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getWoId() { return woId; }
    public Long getPoId() { return poId; }
    public String getPlant() { return plant; }
    public Long getProductId() { return productId; }
    public BigDecimal getQty() { return qty; }
    public BigDecimal getPerUnitRate() { return perUnitRate; }
    public String getWoCode() { return woCode; }
    public Long getPmId() { return pmId; }
    public String getLineItem() { return lineItem; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setWoId(Long woId) { this.woId = woId; }
    public void setPoId(Long poId) { this.poId = poId; }
    public void setPlant(String plant) { this.plant = plant; }
    public void setProductId(Long productId) { this.productId = productId; }
    public void setQty(BigDecimal qty) { this.qty = qty; }
    public void setPerUnitRate(BigDecimal perUnitRate) { this.perUnitRate = perUnitRate; }
    public void setWoCode(String woCode) { this.woCode = woCode; }
    public void setPmId(Long pmId) { this.pmId = pmId; }
    public void setLineItem(String lineItem) { this.lineItem = lineItem; }
}