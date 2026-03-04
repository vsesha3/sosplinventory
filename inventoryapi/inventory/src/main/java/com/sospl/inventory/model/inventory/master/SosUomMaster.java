package com.sospl.inventory.model.inventory.master;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_uom_master_t")

public class SosUomMaster extends BaseAuditEntity {

    @Id
    @Column(name = "uom_id", nullable = false, unique = true)
    private Integer uomId;

    @Column(name = "uom_name", length = 250)
    private String uomName;

    public Integer getUomId() { return uomId; }
    public void setUomId(Integer uomId) { this.uomId = uomId; }

    public String getUomName() { return uomName; }
    public void setUomName(String uomName) { this.uomName = uomName; }
}