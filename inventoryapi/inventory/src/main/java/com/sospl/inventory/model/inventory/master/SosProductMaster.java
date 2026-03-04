package com.sospl.inventory.model.inventory.master;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_product_master_t")
public class SosProductMaster extends BaseAuditEntity {

    @Id
    @Column(name = "product_id", nullable = false, unique = true)
    private Integer productId;

    @Column(name = "product_name", length = 250)
    private String productName;

    @Column(name = "uom_id")
    private Integer uomId;

    @Column(name = "product_code")
    private Integer productCode;

    @Column(name = "fg_lot_code", length = 10)
    private String fgLotCode;

    @Column(name = "product_group_id")
    private Integer productGroupId;

   

    @Column(name = "rate", precision = 11, scale = 2)
    private BigDecimal rate;

    @Column(name = "test_id")
    private Integer testId;

    @Column(name = "conversion_cost", precision = 11, scale = 2)
    private BigDecimal conversionCost;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "packing_type", length = 250)
    private String packingType;

    @Column(name = "prefix", length = 250)
    private String prefix;

    @Column(name = "brand_name", length = 1000)
    private String brandName;

    // Getters & Setters
}