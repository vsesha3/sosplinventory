package com.sospl.inventory.model.inventory.master;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_supplier_master_t")
public class SosSupplierMaster extends BaseAuditEntity {

    @Id
    @Column(name = "supplier_id", nullable = false, unique = true)
    private Integer supplierId;

    @Column(name = "supplier_name", length = 250)
    private String supplierName;

    @Column(name = "supplier_code", length = 10)
    private String supplierCode;

    @Column(name = "address", length = 250)
    private String address;

    @Column(name = "country_id")
    private Integer countryId;

    @Column(name = "type_id")
    private Boolean typeId;

    @Column(name = "supplier_type_id")
    private Boolean supplierTypeId;

    @Column(name = "phone_no", length = 25)
    private String phoneNo;

    @Column(name = "e_mailid", length = 25)
    private String emailId;

    // remaining fields same as earlier version
}