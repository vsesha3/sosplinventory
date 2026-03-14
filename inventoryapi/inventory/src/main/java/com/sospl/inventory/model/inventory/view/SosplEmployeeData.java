package com.sospl.inventory.model.inventory.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

@Entity
@Immutable
@Subselect("SELECT id, employee_id, employee_name FROM dual")
public class SosplEmployeeData {

    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "employee_id")
    private String employeeId;

    @Column(name = "employee_name")
    private String employeeName;

    public Integer getId() { return id; }
    public String getEmployeeId() { return employeeId; }
    public String getEmployeeName() { return employeeName; }
}