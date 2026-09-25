package com.sospl.inventory.model.master;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.sospl.inventory.model.common.BaseAuditEntity;

@Entity
@Table(name = "sos_test_parameter_t")
public class SosTestParameter extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "param_id", nullable = false, unique = true)
    private Long paramId;

    @Column(name = "test_id")
    private Long testId;

    @Column(name = "method", length = 150)
    private String method;

    @Column(name = "limits", length = 150)
    private String limits;

    @Column(name = "specification", length = 150)
    private String specification;

    public Long getParamId() {
        return paramId;
    }

    public void setParamId(Long paramId) {
        this.paramId = paramId;
    }

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getLimits() {
        return limits;
    }

    public void setLimits(String limits) {
        this.limits = limits;
    }

    public String getSpecification() {
        return specification;
    }

    public void setSpecification(String specification) {
        this.specification = specification;
    }
}