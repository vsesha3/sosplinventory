package com.sospl.inventory.model.inventory.master;

import com.sospl.inventory.model.common.BaseAuditEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "sos_product_group_master")
public class SosProductGroupMaster extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_group_id", nullable = false, unique = true)
    private Integer productGroupId;

    @Column(name = "group_name", length = 30)
    private String groupName;

    @Column(name = "ch_head_no")
    private Integer chHeadNo;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getProductGroupId() { return productGroupId; }
    public void setProductGroupId(Integer productGroupId) { this.productGroupId = productGroupId; }

    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }

    public Integer getChHeadNo() { return chHeadNo; }
    public void setChHeadNo(Integer chHeadNo) { this.chHeadNo = chHeadNo; }
}