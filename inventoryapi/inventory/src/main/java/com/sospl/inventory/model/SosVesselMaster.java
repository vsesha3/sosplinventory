package com.sospl.inventory.model;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "sos_vessel_master_t")
public class SosVesselMaster extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vessel_id")
    private Long vesselId;

    @Column(name = "vessel_name", length = 250)
    private String vesselName;

    // ── Getters ───────────────────────────────────────────────────────────
    public Long getVesselId() { return vesselId; }
    public String getVesselName() { return vesselName; }

    // ── Setters ───────────────────────────────────────────────────────────
    public void setVesselId(Long vesselId) { this.vesselId = vesselId; }
    public void setVesselName(String vesselName) { this.vesselName = vesselName; }
}