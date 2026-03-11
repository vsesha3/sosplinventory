package com.sospl.inventory.model.inventory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;

@Entity
@Immutable
@Table(name = "sos_po_details_t")
public class SosPoDetails {

    @Id
    @Column(name = "po_det_id")
    private Long poDetId;

    @Column(name = "po_ref_no")
    private Long poRefNo;

    @Column(name = "po_rm_code")
    private String poRmCode;

    @Column(name = "po_rm_name")
    private String poRmName;

    @Column(name = "po_qty")
    private BigDecimal poQty;

    @Column(name = "po_rate")
    private BigDecimal poRate;

    @Column(name = "po_uom")
    private String poUom;

    @Column(name = "sgst")
    private BigDecimal sgst;

    @Column(name = "sgst_value")
    private BigDecimal sgstValue;

    @Column(name = "po_no_of_packs")
    private BigDecimal poNoOfPacks;

    @Column(name = "po_pack_size")
    private BigDecimal poPackSize;

    @Column(name = "cgst")
    private BigDecimal cgst;

    @Column(name = "cgst_value")
    private BigDecimal cgstValue;

    @Column(name = "igst")
    private BigDecimal igst;

    @Column(name = "igst_value")
    private BigDecimal igstValue;

    @Column(name = "h_s_n_code")
    private String hSnCode;

    @Column(name = "is_active")
    private Boolean isActive;

    public Long getPoDetId() { return poDetId; }
    public Long getPoRefNo() { return poRefNo; }
    public String getPoRmCode() { return poRmCode; }
    public String getPoRmName() { return poRmName; }
    public BigDecimal getPoQty() { return poQty; }
    public BigDecimal getPoRate() { return poRate; }
    public String getPoUom() { return poUom; }
    public BigDecimal getSgst() { return sgst; }
    public BigDecimal getSgstValue() { return sgstValue; }
    public BigDecimal getPoNoOfPacks() { return poNoOfPacks; }
    public BigDecimal getPoPackSize() { return poPackSize; }
    public BigDecimal getCgst() { return cgst; }
    public BigDecimal getCgstValue() { return cgstValue; }
    public BigDecimal getIgst() { return igst; }
    public BigDecimal getIgstValue() { return igstValue; }
    public String getHSnCode() { return hSnCode; }
    public Boolean getIsActive() { return isActive; }
}