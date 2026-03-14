package com.sospl.inventory.repository.inventory.view;

import com.sospl.inventory.model.inventory.view.SosplEmployeeData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SosplEmployeeRepository
        extends JpaRepository<SosplEmployeeData, Integer> {

    @Query(value = """
           SELECT id, employee_id, employee_name
           FROM ${app.schema.attendance}.sospl_employee_data
           ORDER BY employee_name ASC
           """, nativeQuery = true)
    List<SosplEmployeeData> findAllEmployees();

    @Query(value = """
           SELECT id, employee_id, employee_name
           FROM ${app.schema.attendance}.sospl_employee_data
           WHERE LOWER(employee_name) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(employee_id) LIKE LOWER(CONCAT('%', :keyword, '%'))
           ORDER BY employee_name ASC
           """, nativeQuery = true)
    List<SosplEmployeeData> searchEmployees(
            @Param("keyword") String keyword);
}