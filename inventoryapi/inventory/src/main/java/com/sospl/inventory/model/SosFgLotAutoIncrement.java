package com.sospl.inventory.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "sos_fg_lot_auto_increment_t")
public class SosFgLotAutoIncrement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lot_id")
    private Long lotId;

    @Column(name = "product_fg_lot_code", length = 100)
    private String productFgLotCode;

    @Column(name = "year", length = 4)
    private String year;

    @Column(name = "fg_auto")
    private Long fgAuto;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getLotId() { return lotId; }
    public String getProductFgLotCode() { return productFgLotCode; }
    public String getYear() { return year; }
    public Long getFgAuto() { return fgAuto; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setLotId(Long lotId) { this.lotId = lotId; }
    public void setProductFgLotCode(String productFgLotCode) { this.productFgLotCode = productFgLotCode; }
    public void setYear(String year) { this.year = year; }
    public void setFgAuto(Long fgAuto) { this.fgAuto = fgAuto; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}