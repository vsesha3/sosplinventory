package com.sospl.inventory.repository;

import com.sospl.inventory.dto.common.DropDownResponse;
import com.sospl.inventory.util.ParseUtil;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DropDownRepository {

    private final JdbcTemplate jdbcTemplate;

    public DropDownRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ── Helper — map Object[] to DropDownResponse ─────────────────────────
    private List<DropDownResponse> query(String sql) {
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new DropDownResponse(
                        rs.getLong("id"),
                        rs.getString("name")));
    }

    // ── UOM ───────────────────────────────────────────────────────────────
    public List<DropDownResponse> getUomDropdown() {
        return query("""
                SELECT
                    uom_id   AS id,
                    uom_name AS name
                FROM sos_uom_master_t
                WHERE is_active = 1
                AND is_deleted = 0
                ORDER BY uom_name ASC
                """);
    }

    // ── RM Group ──────────────────────────────────────────────────────────
    public List<DropDownResponse> getRmGroupDropdown() {
        return query("""
                SELECT
                    rm_group_id   AS id,
                    rm_group_name AS name
                FROM sos_rm_group_master_t
                WHERE is_active = 1
                AND is_deleted = 0
                ORDER BY rm_group_name ASC
                """);
    }

    // ── Test Master ───────────────────────────────────────────────────────
    public List<DropDownResponse> getTestMasterDropdown() {
        return query("""
                SELECT
                    test_id   AS id,
                    test_name AS name,test_code as testCode
                FROM sos_test_master_t
                WHERE is_active = 1
                AND is_deleted = 0
                ORDER BY test_name ASC
                """);
    }

    // ── Vessel ────────────────────────────────────────────────────────────
    public List<DropDownResponse> getVesselDropdown() {
        return query("""
                SELECT
                    vessel_id   AS id,
                    vessel_name AS name
                FROM sos_vessel_master_t
                WHERE is_active = 1
                AND is_deleted = 0
                ORDER BY vessel_name ASC
                """);
    }

    // ── PM Master ─────────────────────────────────────────────────────────
    public List<DropDownResponse> getPmDropdown() {
        return query("""
                SELECT
                    pm_id   AS id,
                    pm_name AS name
                FROM sos_pm_master_t
                WHERE is_active = 1
                AND is_deleted = 0
                ORDER BY pm_name ASC
                """);
    }

    // ── Product Master ────────────────────────────────────────────────────
    public List<DropDownResponse> getProductDropdown() {
        return query("""
                SELECT
                    product_id   AS id,
                    product_name AS name
                FROM sos_product_master_t
                WHERE is_active = 1
                AND is_deleted = 0
                ORDER BY product_name ASC
                """);
    }

    // ── Supplier ──────────────────────────────────────────────────────────
    public List<DropDownResponse> getSupplierDropdown() {
        return query("""
                SELECT
                    supplier_id   AS id,
                    supplier_name AS name
                FROM sos_supplier_master_t
                WHERE is_active = 1
                AND is_deleted = 0
                ORDER BY supplier_name ASC
                """);
    }

    // ── RM Master ─────────────────────────────────────────────────────────
    public List<DropDownResponse> getRmDropdown() {
        return query("""
                SELECT
                    rm_id   AS id,
                    rm_name AS name
                FROM sos_rm_master_t
                WHERE is_active = 1
                AND is_deleted = 0
                ORDER BY rm_name ASC
                """);
    }

    // ── Work Order ────────────────────────────────────────────────────────
    public List<DropDownResponse> getWorkOrderDropdown() {
        return query("""
                SELECT
                    wo_id   AS id,
                    wo_code AS name
                FROM sos_work_order_t
                WHERE is_active = 1
                AND is_deleted = 0
                ORDER BY wo_code ASC
                """);
    }

    // ── Company Master ────────────────────────────────────────────────────
    public List<DropDownResponse> getCompanyDropdown() {
        return query("""
                SELECT
                    company_id   AS id,
                    company_name AS name
                FROM sos_company_master_t
                WHERE is_active = 1
                AND is_deleted = 0
                ORDER BY company_name ASC
                """);
    }

    // ── Transporter ───────────────────────────────────────────────────────
    public List<DropDownResponse> getTransporterDropdown() {
        return query("""
                SELECT
                    transporter_id   AS id,
                    transporter_name AS name
                FROM sos_transporter_master_t
                WHERE is_active = 1
                AND is_deleted = 0
                ORDER BY transporter_name ASC
                """);
    }

    // ── RM Stock — remaining qty ──────────────────────────────────────────
    public List<DropDownResponse> getRmStockDropdown() {
        return jdbcTemplate.query("""
                SELECT
                    rmId   AS id,
                    rmName AS name,
                    remainingQty AS quantity
                FROM sos_rm_stock_fifo_v
                ORDER BY rmName ASC
                """,
                (rs, rowNum) -> new DropDownResponse(
                        rs.getLong("id"),
                        rs.getString("name"),
                        rs.getString("quantity")));
    }
}