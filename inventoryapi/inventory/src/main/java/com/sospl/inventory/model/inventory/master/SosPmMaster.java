package com.sospl.inventory.model.inventory.master;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_pm_master_t")
public class SosPmMaster extends BaseAuditEntity {

    @Id
    @Column(name = "pm_id", nullable = false, unique = true)
    private Integer pmId;

    @Column(name = "pm_code")
    private Integer pmCode;

    @Column(name = "pm_name", length = 250)
    private String pmName;

    @Column(name = "pm_size")
    private Integer pmSize;

    @Column(name = "fg_lot_code", length = 10)
    private String fgLotCode;

 

    @Column(name = "avg_rate", precision = 11, scale = 2)
    private BigDecimal avgRate;

    @Column(name = "pm_group_id")
    private Integer pmGroupId;

    @Column(name = "tare_wgt", precision = 11, scale = 2)
    private BigDecimal tareWgt;

    @Column(name = "uom_id")
    private Integer uomId;

    @Column(name = "h_nh_id")
    private Integer hNhId;

    // Getters & Setters
}