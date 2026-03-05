package com.sospl.inventory.model.inventory.master;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_test_master_t")
public class SosTestMaster extends BaseAuditEntity {

    @Id
    @Column(name = "test_id", nullable = false, unique = true)
    private Long testId;

    @Column(name = "test_code", length = 25)
    private String testCode;

    @Column(name = "test_name", length = 50)
    private String testName;

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public String getTestCode() {
        return testCode;
    }

    public void setTestCode(String testCode) {
        this.testCode = testCode;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }
}