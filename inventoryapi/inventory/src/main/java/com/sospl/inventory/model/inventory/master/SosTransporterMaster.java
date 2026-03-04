package com.sospl.inventory.model.inventory.master;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_transporter_master_t")
public class SosTransporterMaster extends BaseAuditEntity {

    @Id
    @Column(name = "transporter_id", nullable = false, unique = true)
    private Integer transporterId;

    @Column(name = "transporter_name", length = 30)
    private String transporterName;

    public Integer getTransporterId() { return transporterId; }
    public void setTransporterId(Integer transporterId) { this.transporterId = transporterId; }

    public String getTransporterName() { return transporterName; }
    public void setTransporterName(String transporterName) { this.transporterName = transporterName; }
}