package com.sospl.inventory.mapper;

import com.sospl.inventory.dto.SosProductionPlanResponse;
import com.sospl.inventory.util.ParseUtil;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SosProductionPlanMapper {

    // ── Map single row ────────────────────────────────────────────────────
	public SosProductionPlanResponse mapRow(Object[] row) {

	    SosProductionPlanResponse res =
	            new SosProductionPlanResponse();

	    res.setProductionPlanId(ParseUtil.toLong(row[0]));
	    res.setQty(ParseUtil.toBigDecimal(row[1]));
	    res.setWoId(ParseUtil.toLong(row[2]));
	    res.setWoCode(ParseUtil.toString(row[3]));

	    // ── Handle datetime columns directly ──────────────────────────────
	    res.setFromDate(toLocalDateTime(row[4]));
	    res.setToDate(toLocalDateTime(row[5]));
	    res.setPmId(ParseUtil.toLong(row[6]));
	    res.setPmName(ParseUtil.toString(row[7]));
	    res.setPmSize(ParseUtil.toBigDecimal(row[8]));
	    res.setCompanyId(ParseUtil.toLong(row[9]));
	    res.setCompanyName(ParseUtil.toString(row[10]));
	    res.setPmReq(ParseUtil.toBigDecimal(row[11]));
	    res.setCreatedOn(toLocalDateTime(row[12]));

	    return res;
	}

	// ── Safe LocalDateTime conversion ─────────────────────────────────────────
	private LocalDateTime toLocalDateTime(Object val) {
	    if (val == null) return null;
	    if (val instanceof LocalDateTime) return (LocalDateTime) val;
	    // Handle java.sql.Timestamp from JDBC
	    if (val instanceof java.sql.Timestamp) {
	        return ((java.sql.Timestamp) val).toLocalDateTime();
	    }
	    // Fallback — parse as string
	    return ParseUtil.parseDateTime(String.valueOf(val));
	}

    // ── Map list of rows ──────────────────────────────────────────────────
    public List<SosProductionPlanResponse> mapRows(
            List<Object[]> rows) {
        return rows.stream()
                .map(this::mapRow)
                .collect(Collectors.toList());
    }
}