package com.sospl.inventory.util;

import java.time.LocalDate;

public class GetCurrentFinancialYear {

    private GetCurrentFinancialYear() {}

    /**
     * Returns current Indian Financial Year as string
     * e.g. if today is March 2026 → "2025-2026"
     *      if today is April 2026 → "2026-2027"
     */
    public static String getCurrentFinancialYear() {
        LocalDate today = LocalDate.now();
        return getFinancialYear(today);
    }

    /**
     * Returns Indian Financial Year for a given date
     * April 1 to March 31
     */
    public static String getFinancialYear(LocalDate date) {
        int year  = date.getYear();
        int month = date.getMonthValue();
        int fyStart = (month >= 4) ? year : year - 1;
        int fyEnd   = fyStart + 1;
        return fyStart + "-" + fyEnd;
    }

    /**
     * Returns FY start date (April 1) for current financial year
     */
    public static LocalDate getFyStartDate() {
        LocalDate today = LocalDate.now();
        int year = today.getYear();
        int month = today.getMonthValue();
        int fyStart = (month >= 4) ? year : year - 1;
        return LocalDate.of(fyStart, 4, 1);
    }

    /**
     * Returns FY end date (March 31) for current financial year
     */
    public static LocalDate getFyEndDate() {
        LocalDate today = LocalDate.now();
        int year = today.getYear();
        int month = today.getMonthValue();
        int fyStart = (month >= 4) ? year : year - 1;
        return LocalDate.of(fyStart + 1, 3, 31);
    }
}