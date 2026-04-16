package com.sospl.inventory.util;

import org.slf4j.Logger;

import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;


public class ParseUtil {

    private static final Logger log =
            LoggerFactory.getLogger(ParseUtil.class);

    // ── Private constructor — utility class ───────────────────────────────
    private ParseUtil() {}

    // ── Date / DateTime ───────────────────────────────────────────────────

    /**
     * Parses date string — handles multiple formats:
     * "2026-03-18"
     * "2026-03-18T00:00:00.000Z"
     * "2026-03-18T00:00:00"
     * "2026-03-18T00:00:00.000+05:30"
     */
    public static LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;
        try {
            String cleaned = dateStr
                    .replace("Z", "")
                    .replaceAll("\\.\\d+$", "")     // remove .0 or .000
                    .replaceAll("[+-]\\d{2}:\\d{2}$", "")
                    .trim();

            // Handle space separator
            if (cleaned.contains(" ")) {
                cleaned = cleaned.substring(0, 10); // take date part only
            }

            if (cleaned.contains("T")) {
                return LocalDate.parse(cleaned.substring(0, 10));
            }

            return LocalDate.parse(cleaned);

        } catch (Exception e) {
            log.warn("Invalid date format: {}", dateStr);
            return null;
        }
    }

    /**
     * Parses datetime string — handles multiple formats:
     * "2026-03-18T00:00:00.000Z"
     * "2026-03-18T00:00:00"
     * "2026-03-18"
     * "2026-03-18T00:00:00.000+05:30"
     */
    public static LocalDateTime parseDateTime(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;
        try {
            // Normalize — remove trailing milliseconds and timezone
            String cleaned = dateStr
                    .replace("Z", "")
                    .replaceAll("\\.\\d+$", "")     // remove .0 or .000
                    .replaceAll("[+-]\\d{2}:\\d{2}$", "")
                    .trim();

            // Handle space separator e.g. "2020-09-01 00:00:00"
            if (cleaned.contains(" ") && !cleaned.contains("T")) {
                cleaned = cleaned.replace(" ", "T");
            }

            // Now parse
            if (cleaned.contains("T")) {
                return LocalDateTime.parse(cleaned);
            }

            // Date only — append time
            return LocalDateTime.parse(cleaned + "T00:00:00");

        } catch (Exception e) {
            log.warn("Invalid datetime format: {}", dateStr);
            return null;
        }
    }

    // ── Number Parsers ────────────────────────────────────────────────────

    /**
     * Safely parses String to BigDecimal
     * Returns null if blank or invalid
     */
    public static BigDecimal parseBigDecimal(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return new BigDecimal(value.trim());
        } catch (NumberFormatException e) {
            log.warn("Invalid BigDecimal value: {}", value);
            return null;
        }
    }

    /**
     * Safely parses String to Integer
     * Returns null if blank or invalid
     */
    public static Integer parseInteger(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            log.warn("Invalid Integer value: {}", value);
            return null;
        }
    }

    /**
     * Safely parses String to Long
     * Returns null if blank or invalid
     */
    public static Long parseLong(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return Long.parseLong(value.trim());
        } catch (NumberFormatException e) {
            log.warn("Invalid Long value: {}", value);
            return null;
        }
    }

    /**
     * Safely parses String to Double
     * Returns null if blank or invalid
     */
    public static Double parseDouble(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return Double.parseDouble(value.trim());
        } catch (NumberFormatException e) {
            log.warn("Invalid Double value: {}", value);
            return null;
        }
    }

    /**
     * Safely parses String to Boolean
     * Returns null if blank or invalid
     */
    public static Boolean parseBoolean(String value) {
        if (value == null || value.isBlank()) return null;
        return Boolean.parseBoolean(value.trim());
    }
    
 // ── Object Row Helpers — for native query Object[] mapping ───────────────

    /**
     * Safely converts Object to Long
     * Handles Long, Integer, BigDecimal, String
     */
    public static Long toLong(Object val) {
        if (val == null) return null;
        if (val instanceof Long) return (Long) val;
        if (val instanceof Number) return ((Number) val).longValue();
        try {
            return Long.parseLong(String.valueOf(val).trim());
        } catch (NumberFormatException e) {
            log.warn("Cannot convert to Long: {}", val);
            return null;
        }
    }

    /**
     * Safely converts Object to BigDecimal
     * Handles BigDecimal, Double, Float, Integer, Long, String
     */
    public static BigDecimal toBigDecimal(Object val) {
        if (val == null) return null;
        if (val instanceof BigDecimal) return (BigDecimal) val;
        try {
            return new BigDecimal(String.valueOf(val).trim());
        } catch (NumberFormatException e) {
            log.warn("Cannot convert to BigDecimal: {}", val);
            return null;
        }
    }

    /**
     * Safely converts Object to String
     */
    public static String toString(Object val) {
        if (val == null) return null;
        return String.valueOf(val);
    }

    /**
     * Safely converts Object to Boolean
     * Handles Boolean, TINYINT(1) as Integer, String
     */
    public static Boolean toBoolean(Object val) {
        if (val == null) return null;
        if (val instanceof Boolean) return (Boolean) val;
        if (val instanceof Number) return ((Number) val).intValue() == 1;
        return Boolean.parseBoolean(String.valueOf(val).trim());
    }

    /**
     * Safely converts Object to Integer
     */
    public static Integer toInteger(Object val) {
        if (val == null) return null;
        if (val instanceof Integer) return (Integer) val;
        if (val instanceof Number) return ((Number) val).intValue();
        try {
            return Integer.parseInt(String.valueOf(val).trim());
        } catch (NumberFormatException e) {
            log.warn("Cannot convert to Integer: {}", val);
            return null;
        }
    }
    
    public static LocalDateTime toLocalDateTime(Object val) {
	    if (val == null) return null;
	    if (val instanceof LocalDateTime) return (LocalDateTime) val;
	    if (val instanceof java.sql.Timestamp) {
	        return ((java.sql.Timestamp) val).toLocalDateTime();
	    }
	    return ParseUtil.parseDateTime(String.valueOf(val));
	}
}