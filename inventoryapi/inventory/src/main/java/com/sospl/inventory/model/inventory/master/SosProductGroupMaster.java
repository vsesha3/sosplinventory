package com.sospl.inventory.model.inventory.master;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "sos_product_group_master_t")
public class SosProductGroupMaster extends BaseAuditEntity {

   
   
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_group_id", nullable = false)
    private Long productGroupId;

    @Column(name = "group_name", length = 30)
    private String groupName;

    @Column(name = "ch_head_no")
    private Integer chHeadNo;

   
    public Long getProductGroupId() { return productGroupId; }
    public void setProductGroupId(Long productGroupId) { this.productGroupId = productGroupId; }

    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }

    public Integer getChHeadNo() { return chHeadNo; }
    public void setChHeadNo(Integer chHeadNo) { this.chHeadNo = chHeadNo; }
}