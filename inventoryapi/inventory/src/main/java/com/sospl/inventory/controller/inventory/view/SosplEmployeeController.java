package com.sospl.inventory.controller.inventory.view;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.DropDownResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory/employees")
public class SosplEmployeeController {

    @PersistenceContext
    private EntityManager entityManager;

    @Value("${app.schema.attendance}")
    private String attendanceSchema;

    // Get all — initial dropdown load
    @GetMapping("/dropdown")
    public ResponseEntity<ApiResponse<List<DropDownResponse>>> getDropDown() {
        String sql = "SELECT employee_id, employee_name " +
                     "FROM " + attendanceSchema + ".sospl_employee_data " +
                     "ORDER BY employee_name ASC";

        List<Object[]> results = entityManager
                .createNativeQuery(sql)
                .getResultList();

        List<DropDownResponse> employees = results.stream()
                .map(row -> new DropDownResponse(
                        (String) row[0],   // employee_id
                        (String) row[1]))  // employee_name
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success("Employees fetched successfully",
                        employees));
    }

    // Search — autocomplete as user types
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<DropDownResponse>>> search(
            @RequestParam String keyword) {
        String sql = "SELECT employee_id, employee_name " +
                     "FROM " + attendanceSchema + ".sospl_employee_data " +
                     "WHERE LOWER(employee_name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                     "OR LOWER(employee_id) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                     "ORDER BY employee_name ASC";

        List<Object[]> results = entityManager
                .createNativeQuery(sql)
                .setParameter("keyword", keyword)
                .getResultList();

        List<DropDownResponse> employees = results.stream()
                .map(row -> new DropDownResponse(
                        (String) row[0],   // employee_id
                        (String) row[1]))  // employee_name
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success("Employees fetched successfully",
                        employees));
    }
}