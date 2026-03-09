package com.sospl.inventory.controller.inventory.master;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "sos_pm_group_master_t")
public class SosPmGroupMaster extends BaseAuditEntity {

    @Id
    @Column(name = "pm_group_id", nullable = false, unique = true)
    private Long pmGroupId;

    @Column(name = "pm_group_name", length = 30)
    private String pmGroupName;

    @Column(name = "ch_head_no")
    private Long chHeadNo;

    public Long getPmGroupId() {
        return pmGroupId;
    }

    public void setPmGroupId(Long pmGroupId) {
        this.pmGroupId = pmGroupId;
    }
    
    public String getPmGroupName() {
        return pmGroupName;
    }

    public void setPmGroupName(String pmGroupName) {
        this.pmGroupName = pmGroupName;
    }

    public Long getChHeadNo() {
        return chHeadNo;
    }
    
    

    public void setChHeadNo(Long chHeadNo) {
        this.chHeadNo = chHeadNo;
    }
}