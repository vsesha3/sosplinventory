package com.sospl.inventory.model.inventory.master;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_brand_master_t")
public class SosBrandMaster extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "brand_id", nullable = false, unique = true)
    private Integer brandId;

    @Column(name = "brand_name", length = 200)
    private String brandName;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getBrandId() { return brandId; }
    public void setBrandId(Integer brandId) { this.brandId = brandId; }

    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }
}