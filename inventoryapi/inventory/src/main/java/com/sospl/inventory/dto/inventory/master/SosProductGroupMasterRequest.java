package com.sospl.inventory.dto.inventory.master;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class SosProductGroupMasterRequest {

    @NotNull(message = "Product group ID is required")
    private Integer productGroupId;

    @NotBlank(message = "Group name is required")
    @Size(max = 30, message = "Group name must not exceed 30 characters")
    private String groupName;

    private Integer chHeadNo;

    public Integer getProductGroupId() {
        return productGroupId;
    }

    public void setProductGroupId(Integer productGroupId) {
        this.productGroupId = productGroupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Integer getChHeadNo() {
        return chHeadNo;
    }

    public void setChHeadNo(Integer chHeadNo) {
        this.chHeadNo = chHeadNo;
    }
}