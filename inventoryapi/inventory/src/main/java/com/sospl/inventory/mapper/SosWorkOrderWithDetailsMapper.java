package com.sospl.inventory.mapper;

import com.sospl.inventory.dto.SosWorkOrderWithDetailsResponse;
import com.sospl.inventory.util.ParseUtil;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SosWorkOrderWithDetailsMapper {

    // ── Map single row ────────────────────────────────────────────────────
    public SosWorkOrderWithDetailsResponse mapRow(Object[] row) {

        SosWorkOrderWithDetailsResponse res =
                new SosWorkOrderWithDetailsResponse();

        res.setWoId(ParseUtil.toLong(row[0]));
        res.setPoId(ParseUtil.toLong(row[1]));
        res.setPlant(ParseUtil.toString(row[2]));
        res.setProductId(ParseUtil.toLong(row[3]));
        res.setQty(ParseUtil.toBigDecimal(row[4]));
        res.setPerUnitRate(ParseUtil.toBigDecimal(row[5]));
        res.setPmId(ParseUtil.toLong(row[6]));
        res.setProductCode(ParseUtil.toString(row[7]));
        res.setProductName(ParseUtil.toString(row[8]));
        res.setPmName(ParseUtil.toString(row[9]));

        // ── Calculate totalAmount = qty * perUnitRate ─────────────────────
        BigDecimal qty = res.getQty() != null
                ? res.getQty() : BigDecimal.ZERO;
        BigDecimal perUnitRate = res.getPerUnitRate() != null
                ? res.getPerUnitRate() : BigDecimal.ZERO;
        res.setTotalAmount(qty.multiply(perUnitRate));

        return res;
    }

    // ── Map list of rows ──────────────────────────────────────────────────
    public List<SosWorkOrderWithDetailsResponse> mapRows(
            List<Object[]> rows) {
        return rows.stream()
                .map(this::mapRow)
                .collect(Collectors.toList());
    }
}