package com.sospl.inventory.model.inventory.master;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_capital_goods_master_t")
public class SosCapitalGoodsMaster extends BaseAuditEntity {

    @Id
    @Column(name = "cg_id", nullable = false, unique = true)
    private Integer cgId;

    @Column(name = "cg_code", length = 25)
    private String cgCode;

    @Column(name = "cg_name", length = 100)
    private String cgName;

  
    @Column(name = "uom_id")
    private Integer uom;

    @Column(name = "avg_rate", precision = 11, scale = 2)
    private BigDecimal avgRate;

    // Getters & Setters
}