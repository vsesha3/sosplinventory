package com.sospl.inventory.mapper.inventory;

import com.sospl.inventory.dto.inventory.SosMaterialReceiptWithRMDetailsResponse;
import com.sospl.inventory.util.ParseUtil;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SosMaterialReceiptWithRMDetailsMapper {

    // ── Map single row ────────────────────────────────────────────────────
    public SosMaterialReceiptWithRMDetailsResponse mapRow(Object[] row) {

        SosMaterialReceiptWithRMDetailsResponse res =  // ← fixed class name
                new SosMaterialReceiptWithRMDetailsResponse();

        res.setReceiptId(ParseUtil.toLong(row[0]));
        res.setReceiptMainId(ParseUtil.toLong(row[1]));
        res.setNoOfReceived(ParseUtil.toBigDecimal(row[2]));
        res.setPerUnitRate(ParseUtil.toBigDecimal(row[3]));
        res.setSgstValue(ParseUtil.toBigDecimal(row[4]));
        res.setCgstValue(ParseUtil.toBigDecimal(row[5]));
        res.setIgstValue(ParseUtil.toBigDecimal(row[6]));

        // ── Calculate netAmount = noOfReceived * perUnitRate ──────────────
        BigDecimal noOfReceived = res.getNoOfReceived() != null
                ? res.getNoOfReceived() : BigDecimal.ZERO;
        BigDecimal perUnitRate  = res.getPerUnitRate() != null
                ? res.getPerUnitRate() : BigDecimal.ZERO;
        BigDecimal netAmount    = noOfReceived.multiply(perUnitRate);
        res.setNetAmount(netAmount);

        // ── Calculate totalAmount = netAmount + sgst + cgst + igst ────────
        BigDecimal sgstValue = res.getSgstValue() != null
                ? res.getSgstValue() : BigDecimal.ZERO;
        BigDecimal cgstValue = res.getCgstValue() != null
                ? res.getCgstValue() : BigDecimal.ZERO;
        BigDecimal igstValue = res.getIgstValue() != null
                ? res.getIgstValue() : BigDecimal.ZERO;
        BigDecimal totalAmount = netAmount
                .add(sgstValue)
                .add(cgstValue)
                .add(igstValue);
        res.setTotalAmount(totalAmount);

        return res;
    }

    // ── Map list of rows ──────────────────────────────────────────────────
    public List<SosMaterialReceiptWithRMDetailsResponse> mapRows( // ← fixed return type
            List<Object[]> rows) {
        return rows.stream()
                .map(this::mapRow)
                .collect(Collectors.toList());
    }
}