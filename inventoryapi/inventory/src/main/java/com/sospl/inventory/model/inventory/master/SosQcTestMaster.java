package com.sospl.inventory.model.inventory.master;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_qc_test_master_t")
public class SosQcTestMaster extends BaseAuditEntity {

    @Id
    @Column(name = "qc_test_id", nullable = false, unique = true)
    private Integer qcTestId;

    @Column(name = "qc_test_code", length = 25)
    private String qcTestCode;

    @Column(name = "qc_test_name", length = 100)
    private String qcTestName;

    public Integer getQcTestId() { return qcTestId; }
    public void setQcTestId(Integer qcTestId) { this.qcTestId = qcTestId; }

    public String getQcTestCode() { return qcTestCode; }
    public void setQcTestCode(String qcTestCode) { this.qcTestCode = qcTestCode; }

    public String getQcTestName() { return qcTestName; }
    public void setQcTestName(String qcTestName) { this.qcTestName = qcTestName; }
}