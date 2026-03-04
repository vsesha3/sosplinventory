package com.sospl.inventory.model.inventory.master;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_area_master_t")
public class SosAreaMaster extends BaseAuditEntity {

    @Id
    @Column(name = "area_id", nullable = false, unique = true)
    private Integer areaId;

    @Column(name = "area_name", length = 100)
    private String areaName;

   
    public Integer getAreaId() { return areaId; }
    public void setAreaId(Integer areaId) { this.areaId = areaId; }

    public String getAreaName() { return areaName; }
    public void setAreaName(String areaName) { this.areaName = areaName; }
    
}