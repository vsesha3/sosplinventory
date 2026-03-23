package com.sospl.inventory.repository.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.sospl.inventory.dto.common.PoItemDropDownResponse;

import java.util.List;

@Repository
public class PoItemDropDownRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public PoItemDropDownRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<PoItemDropDownResponse> findByPoType(String poType) {
        String sql;

        switch (poType.toUpperCase()) {
            case "RAW_MATERIAL":
                sql = """
                      SELECT CAST(rm_code AS CHAR) AS code,
                             rm_name               AS name,
                             'RAW_MATERIAL'         AS po_type
                      FROM sos_rm_master_t
                      WHERE is_active = 1 AND is_deleted = 0
                      ORDER BY rm_name ASC
                      """;
                break;

            case "PACKING_MATERIAL":
                sql = """
                      SELECT CAST(pm_code AS CHAR) AS code,
                             pm_name               AS name,
                             'PACKING_MATERIAL'     AS po_type
                      FROM sos_pm_master_t
                      WHERE is_active = 1 AND is_deleted = 0
                      ORDER BY pm_name ASC
                      """;
                break;

            case "CAPITAL_GOODS":
                sql = """
                      SELECT cg_code AS code,
                             cg_name AS name,
                             'CAPITAL_GOODS' AS po_type
                      FROM sos_capital_goods_master_t
                      WHERE is_active = 1 AND is_deleted = 0
                      ORDER BY cg_name ASC
                      """;
                break;

            case "MISCELLANEOUS":
                sql = """
                      SELECT CAST(misc_code AS CHAR) AS code,
                             misc_name               AS name,
                             'MISCELLANEOUS'          AS po_type
                      FROM sos_misc_master_t
                      WHERE is_active = 1 AND is_deleted = 0
                      ORDER BY misc_name ASC
                      """;
                break;

            default:
                throw new RuntimeException(
                        "Invalid poType: " + poType
                        + ". Valid values: RAW_MATERIAL, PACKING_MATERIAL,"
                        + " CAPITAL_GOODS, MISCELLANEOUS");
        }

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new PoItemDropDownResponse(
                        rs.getString("code"),
                        rs.getString("name"),
                        rs.getString("po_type")
                ));
    }
}