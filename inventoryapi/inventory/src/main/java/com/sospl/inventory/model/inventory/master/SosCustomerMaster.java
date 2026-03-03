package com.sospl.inventory.model.inventory.master;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_customer_master_t")
public class SosCustomerMaster extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id", nullable = false, unique = true)
    private Integer customerId;

    @Column(name = "customer_name", length = 250)
    private String customerName;

    @Column(name = "customer_code", length = 250)
    private String customerCode;

    @Column(name = "address", length = 250)
    private String address;

    @Column(name = "delivery_address", length = 250)
    private String deliveryAddress;

    @Column(name = "location", length = 250)
    private String location;

   /* @Column(name = "country_id")
    private Integer countryId;

    @Column(name = "type_id")
    private Integer typeId;

*/
    @Column(name = "g_s_t_no", length = 250)
    private String gstNo;

    // remaining tax/contact fields same as earlier version
}