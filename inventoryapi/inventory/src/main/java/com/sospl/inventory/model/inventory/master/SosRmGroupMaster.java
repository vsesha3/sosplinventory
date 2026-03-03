package com.sospl.inventory.model.inventory.master;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "sos_rm_group_master_t")
public class SosRmGroupMaster extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rm_group_id", nullable = false, unique = true)
    private Integer rmGroupId;

    @Column(name = "rm_group_name", length = 30)
    private String rmGroupName;

    // ===============================
    // Getters & Setters
    // ===============================

    public Long getId() {
        return id;
    }

    public Integer getRmGroupId() {
        return rmGroupId;
    }

    public void setRmGroupId(Integer rmGroupId) {
        this.rmGroupId = rmGroupId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRmGroupName() {
        return rmGroupName;
    }

    public void setRmGroupName(String rmGroupName) {
        this.rmGroupName = rmGroupName;
    }
}