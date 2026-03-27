package com.sospl.inventory.util;

import java.time.LocalDate;

public class GetCurrentFinancialYear {

    private GetCurrentFinancialYear() {}

    public static String getCurrentFinancialYear() {
        return getFinancialYear(LocalDate.now());
    }

    public static String getFinancialYear(LocalDate date) {
        int year    = date.getYear();
        int month   = date.getMonthValue();
        int fyStart = (month >= 4) ? year : year - 1;
        return fyStart + "-" + (fyStart + 1);
    }

    public static LocalDate getFyStartDate() {
        LocalDate today = LocalDate.now();
        int fyStart = (today.getMonthValue() >= 4)
                ? today.getYear() : today.getYear() - 1;
        return LocalDate.of(fyStart, 4, 1);
    }

    public static LocalDate getFyEndDate() {
        LocalDate today = LocalDate.now();
        int fyStart = (today.getMonthValue() >= 4)
                ? today.getYear() : today.getYear() - 1;
        return LocalDate.of(fyStart + 1, 3, 31);
    }
}