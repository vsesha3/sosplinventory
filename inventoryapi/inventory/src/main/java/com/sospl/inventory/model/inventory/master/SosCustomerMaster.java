package com.sospl.inventory.model.inventory.master;

import jakarta.persistence.*;
import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_customer_master_t")
public class SosCustomerMaster extends BaseAuditEntity {

    @Id
    @Column(name = "customer_id", nullable = false, unique = true)
    private Integer customerId;

    @Column(name = "customer_name", length = 250)
    private String customerName;

    @Column(name = "address", length = 250)
    private String address;

    @Column(name = "phone_no", length = 25)
    private String phoneNo;

    @Column(name = "g_s_t_no", length = 250)
    private String gstNo;

    // Getters and Setters
    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    public String getGstNo() {
        return gstNo;
    }

    public void setGstNo(String gstNo) {
        this.gstNo = gstNo;
    }
}