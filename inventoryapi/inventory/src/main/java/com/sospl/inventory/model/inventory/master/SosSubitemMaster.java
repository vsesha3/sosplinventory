package com.sospl.inventory.model.inventory.master;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_subitem_master_t")
public class SosSubitemMaster extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subitem_id", nullable = false, unique = true)
    private Integer subitemId;

    @Column(name = "subitem_code", length = 250)
    private String subitemCode;

    @Column(name = "subitem_name", length = 250)
    private String subitemName;

    // other business fields remain same as earlier
}